import { ApiError } from 'next/dist/server/api-utils';
import db from '../../database'
import { fetchJobList, fetchJobResult } from '../../util/lib/utils';

async function getUserName(api_key) {
  const user_sql = 'SELECT username FROM users WHERE api_key = ?';
  const user_params = [api_key];

  return new Promise((resolve, reject) => {
    db.get(user_sql, user_params, (err, row) => {
      if (err) {
        reject(new Error('Internal Server error'));
      } else if (row === undefined) {
        reject(new Error('api_key not found'));
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

async function insertComputationData(username, job_id) {
  try {
    const job_status = await synchronizeFujitsuData(job_id);
    let sql, params;
    if (job_status === undefined) {
      sql = 'INSERT INTO test_service_stats (username, job_id) VALUES (?, ?)';
      params = [username, job_id];
    } else {
      sql = 'INSERT INTO test_service_stats (username, job_id, status, start_time) VALUES (?, ?, ?, ?)';
      params = [username, job_id, job_status.job_status, job_status.start_time];
    }
    console.log(sql, params)
    db.run(sql, params, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          let update_sql, update_params;
          if (job_status === undefined) {
            update_sql = 'UPDATE test_service_stats SET username = ? WHERE job_id = ?';
            update_params = [username, job_id];
          } else {
            update_sql = 'UPDATE test_service_stats SET username = ?, status = ?, start_time = ? WHERE job_id = ?';
            update_params = [username, job_status.job_status, job_status.start_time, job_id];
          }
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


// get the solution from the Fujitsu API
async function getSolution(job_id) {
  try {
    const job_result = await fetchJobResult(job_id);
    console.log("job_result line 76", job_result)
    // solve time
    const solve_time = job_result.qubo_solution.timing.solve_time;

    // update the solve time in the database
    const sql = 'UPDATE test_service_stats SET computation_time_ms = ? WHERE job_id = ?';

    const params = [solve_time, job_id];

    // console.log(solve_time);
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) {
          reject(new Error('Internal Server error'));
        }
        resolve();
      });
    })
  } catch (err) {
    throw new Error('Error fetching Fujitsu job data: ' + err.message);
  }
}

// post the following json object to this api
// {
//      "api_key" : "",
//      "job_id" : "",
//      "solve_time" : ""
// }
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { api_key, job_id, time_limit_sec } = req.body;
    try{
      const username = await getUserName(api_key);
      try{
        await insertComputationData(username, job_id);
        try{
          const job_status = await getSolution(job_id);
          res.status(200).json({'message' : 'success'});
        }catch(err){
          res.status(400).json({error : err.message});
        }
      }catch(err){
        // internal server error
        res.status(500).json({error : err.message});
      }
    }catch(err){
      // api_key not found
      console.log(err.message)
      res.status(401).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'only POST method allowed' });
  }
}
