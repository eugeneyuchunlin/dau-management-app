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
    console.log("fetching job list")
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
