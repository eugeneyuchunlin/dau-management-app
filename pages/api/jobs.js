import db from "../../database"
import FUJITSU_API_KEY from "../../config"

import { fetchJobList } from "../lib/utils"


async function deleteJob(job_id) {
    const url = 'https://api.aispf.global.fujitsu.com';
    const end_point = '/da/v3/async/jobs/result/' + job_id;
    const options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // "X-Access-Token": token
            "X-Api-Key": FUJITSU_API_KEY
        }
    }
    const response = await fetch(url + end_point, options);
    const data = await response.json();
    return response
}

// make the job list from fujitsu and db consistent
function synchronizeDB(data, existed_job_id) {
    // console.log("synchronizeDB : ", data)
    // seperate the data into two parts
    // one part is each entry in data whose job_id in existed_job_id

    var unknown_username_job_list = []
    var known_username_job_list = []
    console.log('existed job id', existed_job_id)
    data["job_status_list"].forEach((job) => {
        if(existed_job_id.includes(job.job_id)){
            known_username_job_list.push(job)
        } else {
            unknown_username_job_list.push(job)
        }
    })

    // if size of unknown_username_job_list is not 0
    if(unknown_username_job_list.length > 0){
        console.log("Insert unknown data")
        // for those unknown username_job_list, insert them into the db
        const sql = 'INSERT INTO service_stats (username, job_id, status, start_time)';
        const values = unknown_username_job_list.map((job) => [job.username, job.job_id, job.job_status, job.start_time])
        const flattenedValues = [].concat.apply([], values);
        const placeholders = values.map(() => "(?, ?, ?, ?)").join(",");
        const insert_sql = `${sql} VALUES ${placeholders}`;
        console.log('insert_sql', insert_sql)
        console.log('flattenedValues', flattenedValues)

        db.run(insert_sql, flattenedValues, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }

    if(known_username_job_list.length > 0){
        console.log("Update known data")

        // FIXME: shouldn't update the data so frequently

        // for those known username_job_list, update the db
        const update_sql = 'UPDATE service_stats SET status = ?, start_time = ? WHERE job_id = ?';
        known_username_job_list.forEach((job) => {
            db.run(update_sql, [job.job_status, job.start_time, job.job_id], (err) => {
                if (err) {
                    console.log(err);
                }
            })
        })

    }


}

function joinDBData(data) {
    return new Promise((resolve, reject) => {
        const job_id_list = data["job_status_list"].map((job) => job["job_id"])
        // const job_id_list = ['job_id_1', 'job_id_45', 'job_id_2']

        const placeholders = job_id_list.map(() => "?").join(",");
        // console.log(placeholders)
        const sql = `select username, job_id from service_stats where job_id in (${placeholders})`;
        db.all(sql, job_id_list, (err, result) => {
            if (err) {
                console.log("Error fetching data from db")
                console.log(err);
                reject(err);
            }

            var job_id_map_username = {}
            var existed_job_id = []
            result.forEach((row) => {
                job_id_map_username[row.job_id] = row.username
                existed_job_id.push(row.job_id)
            })

            data["job_status_list"].forEach((job) => {
                if (job["job_id"] in job_id_map_username) {
                    job["username"] = job_id_map_username[job["job_id"]]
                } else {
                    job["username"] = "unknown"
                }
            })
            synchronizeDB(data, existed_job_id);
            resolve(data);
        })
    })
}

export default async function handler(req, res) {
    return new Promise((resolve, reject) => {
        if (req.method === 'POST') {
            // delete the job
            console.log('delete job')
            // TODO: check the cookie is valid
            
            deleteJob(req.body.job_id).then((response) => {
                // console.log(response);
                res.status(response.status).json({ message: 'delete successfully' })
                resolve();
            }).catch((err) => {
                console.log(err)
                res.status(500).json({ 'message': err })
                resolve()
            })
        } else if (req.method === 'GET') {
            // get the job from fujitsu
            fetchJobList().then((data) => {
                return joinDBData(data).then((data) => {
                    res.status(200).json(data);
                    resolve();
                })
            }).catch((err) => {
                res.status(500).json({ 'message': err })
                reject(err)
            })
        } else {
            res.status(405).json({ message: 'Method not allowed' });
            resolve();
        }
        return;
    })
}