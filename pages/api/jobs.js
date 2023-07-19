import db from "../../database"
import FUJITSU_API_KEY from "../../config"
import { URL, RESULT_END_POINT } from "../../common/constants/url"
import { TABLE_NAME } from "../../common/constants/constant"

import { fetchJobList, getSolveTimeAndStatusOfJobId } from "../../util/lib/utils"
// import {}

/**
 * Delete the job on the Fujitsu server
 * @param {[String]} job_id The job_id you'd like to delete
 * @returns {[Response]]} response The response of the Fujitsu server of the delete request
 */
async function deleteJob(job_id) {
    const url = URL;
    const end_point = RESULT_END_POINT + job_id;
    const options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Api-Key": FUJITSU_API_KEY
        }
    }
    return new Promise((resolve, reject) => {
        fetch(url + end_point, options).then((response) => {
            resolve(response)
        }).catch((err) => {
            reject(err)
        })
    })
}

function insertAndUpdateUnknownJobs(data, sql, paramater_generate_function) {
    console.log("insertAndUpdateUnknownJobs : ",data)
    data.forEach((job)=>{
        const params = paramater_generate_function(job);
        db.run(sql, params, (err) => {
            if (err) {
                console.log(err);
            }
        })
    })
}

// make the job list from fujitsu and db consistent
function synchronizeDB(data, existed_job_id) {
    // console.log("synchronizeDB : ", data)
    // seperate the data into two parts
    // one part is each entry in data whose job_id in existed_job_id

    var unknown_username_job_list = []
    var known_username_job_list = []
    // console.log('existed job id', existed_job_id)
    data["job_status_list"].forEach((job) => {
        if (existed_job_id.includes(job.job_id)) {
            known_username_job_list.push(job)
        } else {
            unknown_username_job_list.push(job)
        }
    })

    // if size of unknown_username_job_list is not 0
    if (unknown_username_job_list.length > 0) {
        // console.log("Insert unknown data")

        // seperate the data into two parts
        // the job in the first part if its status is Done
        // the job in the second part if its status is not Done
        var unknown_username_job_list_done = []
        var unknown_username_job_list_not_done = []
        unknown_username_job_list.forEach((job) => {
            if (job.job_status === "Done") {
                unknown_username_job_list_done.push(job)
            } else {
                unknown_username_job_list_not_done.push(job)
            }
        })

        if (unknown_username_job_list_done.length > 0) {
            insertAndUpdateUnknownJobs(
                unknown_username_job_list_done,
                `INSERT INTO ${TABLE_NAME} 
                (username, job_id, status, start_time, start_time_utc8, computation_time_ms) VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT (job_id) DO UPDATE SET username = ?, status = ?, start_time = ?, start_time_utc8 = ?, computation_time_ms = ?`,
                (job) => [
                    job.username, job.job_id, job.job_status,
                    job.start_time, job.start_time_utc8, job.solve_time, job.username,
                    job.job_status, job.start_time, job.start_time_utc8, job.solve_time
                ]
            )
        }

        if (unknown_username_job_list_not_done.length > 0) {
            insertAndUpdateUnknownJobs(
                unknown_username_job_list_not_done,
                `INSERT INTO ${TABLE_NAME} 
                (username, job_id, status, start_time, start_time_utc8) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (job_id) DO UPDATE SET username = ?, status = ?, start_time = ?, start_time_utc8 = ?`,
                (job) => [
                    job.username, job.job_id, job.job_status,
                    job.start_time, job.start_time_utc8, job.username, job.job_status, job.start_time, job.start_time_utc8
                ]
            ) 
        }

    }

    if (known_username_job_list.length > 0) {
        // console.log("Update known data")

        // FIXME: shouldn't update the data so frequently

        // for those known username_job_list, update the db
        known_username_job_list.forEach((job) => {
            var solve_time_placeholder;
            var params;
            if (job.job_status === "Done") {
                // get the solve time
                solve_time_placeholder = ", computation_time_ms = ?"
                params = [job.job_status, job.start_time, job.start_time_utc8, job.solve_time, job.job_id]
            } else {
                solve_time_placeholder = ""
                params = [job.job_status, job.start_time, job.start_time_utc8, job.job_id]
            }
            const update_sql = `UPDATE ${TABLE_NAME} SET status = ?, start_time = ?, start_time_utc8 = ? ${solve_time_placeholder} WHERE job_id = ?`;

            db.run(update_sql, params, (err) => {
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
        const sql = `select username, job_id from ${TABLE_NAME} where job_id in (${placeholders})`;
        db.all(sql, job_id_list, async (err, result) => {
            if (err) {
                console.log("Error fetching data from db, ", err)
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
            resolve(data);
            data = await getSolveTimeForEachJob(data);
            synchronizeDB(data, existed_job_id);
        })
    })
}

export async function getSolveTimeForEachJob(data) {
    await Promise.all(data.job_status_list.map(async (job) => {
        if (job.job_status === "Done") {
            const job_id = job.job_id;
            const { solve_time, status } = await getSolveTimeAndStatusOfJobId(job_id);

            job.solve_time = solve_time;
        }
    }));

    // console.log("getSolveTimeForEachJob: ", data);
    return data;
}


/**
 * The handler function of the jobs api
 * 
 * When fetching the endpoint /api/jobs,  the handler will handle the request either it is GET or POST
 * If the method is GET, the api will return the job list from the Fujitsu server
 * If the method is POST, the api will delete the job on the Fujitsu server
 * @param {[Request]} req 
 * @param {[Response]} res 
 * @returns 
 */
export default async function handler(req, res) {
    return new Promise((resolve, reject) => {
        if (req.method === 'POST') {
            // delete the job
            // console.log('delete job')
            // TODO: check the cookie is valid

            deleteJob(req.body.job_id).then(async (response) => {
                const data = await response.json();
                if(data.status === 'Deleted'){
                    data.message = 'delete successfully'
                }else if(data.status === 'Running'){
                    data.message = 'job is running'
                }else if(data.status === 'Canceled'){
                    data.message = 'job is canceled'
                }else if(data.status === 'Waiting'){
                    data.message = 'job is waiting'
                }else if(data.status === undefined){
                    data.message = 'Unknown status'
                }
                res.status(response.status).json({ 
                    status : data.status,
                    message: data.message
                })
                resolve();
            }).catch((err) => {
                console.log(err)
                res.status(500).json({ 'message': err })
                resolve()
            })
        } else if (req.method === 'GET') {
            // get the job from fujitsu
            fetchJobList().then(async (data) => {
                const data_2 = await joinDBData(data);
                res.status(200).json(data_2)
                resolve();
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