import { ApiError } from 'next/dist/server/api-utils';
import db from '../../database'
import { fetchJobList } from '../lib/utils';

function getUserName(api_key) {
  return new Promise((resolve, reject) => {
    const user_sql = 'SELECT username FROM users WHERE api_key = ?';
    const user_params = [api_key];
    db.get(user_sql, user_params, (err, row) => {
      if (err) {
        reject('Internal Server error');
      } else if (row === undefined) {
        reject('api_key not found');
      } else {
        resolve(row.username);
      }
    });
  });
}

async function synchronizeFujitsuData(job_id) {
  try {
    const data = await fetchJobList();
    const job_status_list = data.job_status_list;
    const job_status = job_status_list.find((job) => job.job_id === job_id);
    console.log("fujitsu job status", job_status)
    return job_status;
  } catch (err) {
    throw new Error('Error fetching Fujitsu job data');
  }
}

async function insertComputationData(username, job_id, solve_time) {
  try {
    const job_status = await synchronizeFujitsuData(job_id);
    let sql, params;
    if (job_status === undefined) {
      sql = 'INSERT INTO service_stats (username, job_id, computation_time_ms) VALUES (?, ?, ?)';
      params = [username, job_id, solve_time];
    } else {
      sql = 'INSERT INTO service_stats (username, job_id, computation_time_ms, status, start_time) VALUES (?, ?, ?, ?, ?)';
      params = [username, job_id, solve_time, job_status.job_status, job_status.start_time];
    }
    console.log(sql, params)
    db.run(sql, params, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          let update_sql, update_params;
          if(job_status === undefined){
            update_sql = 'UPDATE service_stats SET username = ?, computation_time_ms = ? WHERE job_id = ?';
            update_params = [username, solve_time, job_id]; 
          }else{
            update_sql = 'UPDATE service_stats SET username = ?, computation_time_ms = ?, status = ?, start_time = ? WHERE job_id = ?';
            update_params = [username, solve_time, job_status.job_status, job_status.start_time, job_id];
          }
          console.log(update_sql, update_params)
          db.run(update_sql, update_params, (err) => {
            if (err) {
              throw new Error('Internal Server error');
            }
          });
        } else {
          throw new Error('Internal Server error');
        }
      }
    });
  } catch (err) {
    throw new Error('Error inserting computation data');
  }
}

// post the following json object to this api
// {
//      "api_key" : "",
//      "job_id" : "",
//      "solve_time" : ""
// }
export default async function (req, res) {
  if (req.method === 'POST'){
    try{
      const { api_key, job_id, solve_time } = req.body;
      const username = await getUserName(api_key);
      await insertComputationData(username, job_id, solve_time);
      res.status(200).json({ message: 'success' });
    }catch (err){
      res.status(401).json({ error: err });
    }
  }else{
    res.status(405).json({ error: 'only POST method allowed' });
  }
}