import FUJITSU_API_KEY from "../../config";

export async function fetchJobList() {
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
        date.setUTCHours(date.getUTCHours() + 8)
        const newDatetimeString = date.toISOString().replace("T", " ").replace("Z", "");
        job.start_time = newDatetimeString;
    })
    return data;
}

export async function fetchJobResult(job_id) {
    const url = 'https://api.aispf.global.fujitsu.com';
    const end_point = '/da/v3/async/jobs/result/' + job_id;
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
    const current_year = current_date.getFullYear();
    let current_month = current_date.getMonth() + 1;

    return daysInTheMonth(current_year, current_month);
}

// get the solution from the Fujitsu API
export async function getSolveTimeOfJobId(job_id) {
    return new Promise((resolve, reject) => {
        try {
  
          const interval_id = setInterval(async () => {
            const job_result = await fetchJobResult(job_id);
  
            if(job_result.status === 'Done'){
              // job is done
  
              clearInterval(interval_id);
              resolve(job_result.qubo_solution.timing.solve_time) 
            }
  
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
