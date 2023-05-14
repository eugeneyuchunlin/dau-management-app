const crypto = require('crypto');
const { copyFileSync } = require('fs');
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to the SQlite database.')
})

module.exports = db



function generateFakeData() {
    const fake_data = [];

    for (let i = 0; i < 5; ++i) {
        const username = ('user' + i);
        for (let j = 0; j < 20; j++) {
            const job_id = 'job_id_' + i + '_' + j;
            const computation_time_ms = Math.floor(Math.random() * 300000);
            const status = 'Done';
            // randomly choose a  start_time from 2023-05-01 00:00:00 to 2023-05-31
            // 23:59:59 Get the timestamps for May 1st and May 31st of 2023
            const may1stTimestamp = new Date('2023-05-01T00:00:00Z').getTime();
            const may31stTimestamp = new Date('2023-05-31T23:59:59Z').getTime();

            // Generate a random timestamp between May 1st and May 31st of 2023
            const randomTimestamp =
                Math.floor(Math.random() * (may31stTimestamp - may1stTimestamp + 1)) +
                may1stTimestamp;

            // Convert the timestamp to an ISO string with UTC timezone
            const randomTimeISO = new Date(randomTimestamp)
                .toISOString()
                .replace('T', ' ')
                .replace('Z', '');

            // Use the randomTimeISO value as the start_time value in the database
            // insert statement console.log(randomTimeISO);

            const start_time = randomTimeISO;
            fake_data.push(
                [username, job_id, computation_time_ms, status, start_time]);
        }
    }

    // flatten the fake_data list
    const flattened_fake_data = fake_data.flat();
    // console.log(flattened_fake_data);

    const placeholders = fake_data.map((value) => '(?, ?, ?, ?, ?)').join(',');

    const insert_sql =
        `INSERT INTO test_service_stats (username, job_id, computation_time_ms, status, start_time) VALUES ${placeholders};`;
    console.log(insert_sql)
    db.run(insert_sql, flattened_fake_data, (err) => {
        if (err) {
            console.log(err);
        }
    })
}



function registerNewUser(username, password) {
    const hash_password = crypto.createHash('sha256').update(password).digest('hex');

    const date = new Date()

    const api_key = crypto.createHash('sha256').update(username + password + date.toISOString()).digest('hex');  
    const sql = `INSERT INTO users (username, password, api_key) VALUES (?, ?, ?);`;
    const params = [username, hash_password, api_key];
    db.run(sql, params, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

async function changePassword(username, newpassword){
    const hash_password = crypto.createHash('sha256').update(newpassword).digest('hex');
    const sql = `UPDATE users SET password = ? WHERE username = ?;`;
    const params = [hash_password, username];
    db.run(sql, params, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

async function getTheAPIKey(username) {
    const sql = `SELECT api_key FROM users WHERE username = ?;`;
    const params = [username];
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(row.api_key);
            }
        })
    })
}

async function addUnknownJobs(solve_time) {
    const sql =
        `INSERT INTO service_stats (username, job_id, computation_time_ms, status, start_time) VALUES (?, ?, ?, ?, ?);`;

    const date = new Date();
    const datetime_string = crypto.createHash('sha256').update(date.toISOString().replace('T', ' ').replace('Z', ''))
            .digest('hex');

    const params = [
        'unknown', 'unknown_' + datetime_string, solve_time, 'Done',
        new Date().toISOString().replace('T', ' ').replace('Z', '')
    ];
    db.run(sql, params, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

// registerNewUser('yoyo', 'Iammy310072');
// getTheAPIKey('Chun').then((api_key) => {
//     console.log(api_key)
// })

async function solveRequest(time_limit_sec){
    return new Promise((resolve, reject) => {
        const url = "http://localhost:3000";
        const end_point = "/api/solve";

        fetch(url + end_point, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                time_limit_sec: time_limit_sec,
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            const job_id = data.job_id;
            resolve(job_id);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function postRequest(job_id, api_key, solve_time){
    return new Promise((resolve, reject) => {
        const url = "http://localhost:3001";
        const end_point = "/api/posts";

        fetch(url + end_point, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                job_id: job_id,
                api_key: api_key,
                solve_time: solve_time
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}


async function solveAndPostRequest(user, time_limit_sec){

    const job_id = await solveRequest(time_limit_sec);
    console.log("job_id : ", job_id)
    const api_key = await getTheAPIKey(user);
    console.log("api_key : ", api_key);
    await postRequest(job_id, api_key, time_limit_sec); 
}
