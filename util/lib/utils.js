import FUJITSU_API_KEY from "../../config";
import { URL, RESULT_END_POINT, JOBS_END_POINT } from "../../common/constants/url"
import { TABLE_NAME } from "../../common/constants/constant"

export async function fetchJobList() {
    const url = URL;
    const end_point = JOBS_END_POINT;
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // "X-Access-Token": token
            "X-Api-Key": FUJITSU_API_KEY
        }
    }
    // console.log("fetching job list")
    const response = await fetch(url + end_point, options);
    const data = await response.json();
    // console.log(data)

    // for each job in job_status_list
    // convert the start_time to a date object
    // convert the date object to a string
    // replace the start_time with the string
    // return the data
    data.job_status_list.forEach((job) => {
        const date = new Date(job.start_time);
        date.setUTCHours(date.getUTCHours())

        const date_utc = new Date(job.start_time);
        date_utc.setUTCHours(date_utc.getUTCHours() + 8)

        const dateUTCDateTimeString = date_utc.toISOString().replace("T", " ").replace("Z", "");
        const newDatetimeString = date.toISOString().replace("T", " ").replace("Z", "");
        job.start_time = newDatetimeString;
        job.start_time_utc8 = dateUTCDateTimeString;
    })
    return data;
}

export async function fetchJobResult(job_id) {
    const url = URL;
    const end_point = RESULT_END_POINT + job_id;
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // "X-Access-Token": token
            "X-Api-Key": FUJITSU_API_KEY
        }
    }
    const response = await fetch(url + end_point, options);
    const data = await response.json();
    // console.log("status : ", response.status)
    // console.log("fetchJobResult ", data)

    if (response.status === 400) {
        throw new Error(data.message[0].message);
    }
    return data;
}

export const daysInTheMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
}

export const daysInCurrentMonth = () => {
    const current_date = new Date();
    const current_year = current_date.getUTCFullYear();
    let current_month = current_date.getUTCMonth() + 1;

    return daysInTheMonth(current_year, current_month);
}

// get the solution from the Fujitsu API
export async function getSolveTimeAndStatusOfJobId(job_id) {
    return new Promise((resolve, reject) => {
        try {
  
          const interval_id = setInterval(async () => {
            fetchJobResult(job_id).then((job_result) => {
                if(job_result.status === 'Done'){
                  // job is done
                  clearInterval(interval_id);

                  resolve({
                    solve_time : job_result.qubo_solution.timing.solve_time,
                    status : job_result.status
                  })
                }else if (job_result.status === 'Cancled'){
                    // job is cancled
                    console.log("job_id", job_id, " is cancled" )
                    clearInterval(interval_id);
                    resolve({
                        solve_time : null,
                        status : job_result.status
                    })
                }
            }).catch((err) => {
                clearInterval(interval_id);
                console.log("err : ", err)
            })
  
          }, 1500);
  
        } catch (err) {
          console.log('Failed to get solution from Fujitsu API')
          // throw new Error('Error fetching Fujitsu job data: ' + err.message);
        }
    })
    
  }

export async function getDailyDataFromDatabase(db, year, month){

    const days_in_month = daysInTheMonth(year, month);

    // make the the current_month is 2 digits
    if(month < 10){
        month = '0' + month;
    }

    const sql = `SELECT username, DATE(start_time) AS start_time, SUM(computation_time_ms) AS daily_computation_time 
    FROM ${TABLE_NAME} WHERE start_time >= '${year}-${month}-01 00:00:00' AND start_time <= '${year}-${month}-${days_in_month} 23:59:59' GROUP BY username, date(start_time)`

    // console.log(sql);

    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err.message);
                reject(err);
            }
            // console.log("rows : ", rows);
            
            const daily_data = [];
            const user_data = {}

            for(var i = 0; i < rows.length; ++i){
                const row = rows[i];
                if(!(row.username in user_data)){
                    user_data[row.username] = [];
                }
                user_data[row.username].push(row)
            }
            
            // console.log(user_data)

            for(const username in user_data){
                const user_daily_data = {};
                user_daily_data['username'] = username;
                user_daily_data['data'] = [];

                const user_rows = user_data[username];
                var date = 1;
                for(var i = 0; i < user_rows.length; ++i){
                    // get the date of user_rows[i].start_time
                    const row = user_rows[i];
                    const row_date = new Date(row.start_time).getDate();
                    // console.log("row_date : ", row_date);
                    while(date < row_date){
                        user_daily_data['data'].push(0)
                        date += 1;
                    }
                    user_daily_data['data'].push(row.daily_computation_time / 60000);
                    date += 1;
                }
                while(date <= days_in_month){
                    user_daily_data['data'].push(0);
                    date += 1;
                }
                daily_data.push(user_daily_data);
            }
            // console.log(daily_data)
            resolve(daily_data);
        })
    })
}

export async function getDataFromDatabase(db, year, month){

    const days_in_month = daysInTheMonth(year, month);

    // make the the current_month is 2 digits
    if(month < 10){
        month = '0' + month;
    }

    // query the database for the data in the current month
    const sql = `SELECT username, SUM(computation_time_ms) AS total_time 
    FROM ${TABLE_NAME} WHERE start_time >= '${year}-${month}-01 00:00:00' AND start_time <= '${year}-${month}-${days_in_month} 23:59:59'
    GROUP BY username;`

    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err.message);
                reject(err);
            }
            // console.log(rows);
            // sum of total_time 
            const sum = rows.reduce((acc, item) => acc + item.total_time, 0);
            // console.log(sum);
            rows.push({username: 'remain', total_time: 54000000 - sum});

            // the unit of the total_time is ms, convert it to minute
            rows.forEach((item) => {
                item.total_time = item.total_time / 60000;
            })

            // console.log(rows)

            resolve(rows);
        });
    })
}

export default function util() {
    return (<></>)
}
