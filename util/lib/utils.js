import FUJITSU_API_KEY from "../../config";
import { URL, RESULT_END_POINT, JOBS_END_POINT } from "../../common/constants/url"

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
  
          }, 3000);
  
        } catch (err) {
          console.log('Failed to get solution from Fujitsu API')
          // throw new Error('Error fetching Fujitsu job data: ' + err.message);
        }
    })
    
  }

export default function util() {
    return (<></>)
}
