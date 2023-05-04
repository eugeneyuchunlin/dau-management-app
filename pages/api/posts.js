import db from '../../database'

function getUserName(api_key){
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

// post the following json object to this api
// {
//      "api_key" : "",
//      "job_id" : "",
//      "start_time" : "",
//      "solve_time" : ""
// }
function insertComputationData(username, job_id, start_time, solve_time){
  return new Promise((resolve, reject) => {
    const sql =
        'INSERT INTO service_stats (username, job_id, start_time, computation_time_ms) VALUES (?, ?, ?, ?)';
    const params = [username, job_id, start_time, solve_time];
    db.run(sql, params, (err) => {
      if (err) {
        // UNIQUE constraint failed: service_stats.job_id
        reject('job_id already exists');
      } else {
        resolve();
      }
    });
  });
}

export default async function(req, res){
  return new Promise((resolve, reject)=> {
    if(req.method === 'POST'){
      const {api_key, job_id, start_time, solve_time} = req.body;
      getUserName(api_key).then((username) => {
        return insertComputationData(username, job_id, start_time, solve_time);
      }).then(()=> {
        res.status(200).json({message: 'success'});
        resolve();
      }).catch((err)=> {
        res.status(401).json({error: err});
        resolve();
      });
    }else{
      res.status(405).json({error: 'only POST method allowed'});
      resolve();
    }
    return; // add this line to always return a Promise
  });
}
