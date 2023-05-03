import React from 'react';
import db from '../database'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Nvbar from './components/nvbar.js'
import { LoginProvider } from './contexts/LoginContext';

ChartJS.register(ArcElement, Tooltip, Legend);


export default function HomePage({data}){
    console.log(data)


    const fake_data = {
        labels: data.map((item) => item.username),
        datasets: [
          {
            label: 'usage',
            data: data.map((item) => item.total_time),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    return (
        <>
            <LoginProvider>
                <Nvbar />
            </LoginProvider>
            {/* <Pie data={fake_data} /> */}
        </>
    )

}

export async function getStaticProps(){
    const data = await getDataFromDatabase();
    return {
        props: {
            data
        }
    }
}

async function getDataFromDatabase(){
    const sql = `SELECT id, username, SUM(computation_time_ms) AS total_time
    FROM service_stats
    GROUP BY username;`

    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err.message);
                reject(err);
            }
            // console.log(rows);
            resolve(rows);
        });
    })
}