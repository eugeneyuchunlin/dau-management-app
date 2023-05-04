import db from "../../database"
import FUJITSU_API_KEY from "../../config"

async function fetchJobList() {
    const url = 'https://api.aispf.global.fujitsu.com';
    const end_point = '/da/v3/async/jobs';
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // "X-Access-Token": token
            "X-Api-Key": FUJITSU_API_KEY
        }
    }
    console.log("fetching job list")
    const response = await fetch(url + end_point, options);
    const data = await response.json();
    // console.log(data)
    return data;
}

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
            result.forEach((row) => {
                job_id_map_username[row.job_id] = row.username
            })

            data["job_status_list"].forEach((job) => {
                if (job["job_id"] in job_id_map_username) {
                    job["username"] = job_id_map_username[job["job_id"]]
                } else {
                    job["username"] = "unknown"
                }
            })
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