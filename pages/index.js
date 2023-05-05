import React from 'react';
import db from '../database'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Nvbar from './components/nvbar.js'
import { LoginProvider } from './contexts/LoginContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

ChartJS.register(ArcElement, Tooltip, Legend);


export default function HomePage({data}){
    console.log(data)


    const graph_data = {
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
    const options = {
        responsive: true,
        maintainAspectRatio: false, // set to false to allow adjusting chart size
      };
    return (
        <>
            <LoginProvider>
                <Nvbar />
            </LoginProvider>
            <Container fluid="xl">
                <Row>
                    <Col>

                        <div className='maincontainer'>
                            <Pie data={graph_data} options={options} height={400}/>
                        </div>
                    </Col>
                </Row>
            </Container>
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
    // get the current month and days
    const current_date = new Date();
    // const current_year = current_date.getFullYear();
    let current_month = current_date.getMonth() + 1;

    // get the number of days in the current month
    const days_in_month = new Date(current_date.getFullYear(), current_month, 0).getDate();

    // make the the current_month is 2 digits
    if(current_month < 10){
        current_month = '0' + current_month;
    }

    // query the database for the data in the current month
    const sql = `SELECT id, username, SUM(computation_time_ms) AS total_time 
    FROM service_stats WHERE start_time BETWEEN '2023-${current_month}-01 00:00:00' AND '2023-05-${days_in_month} 23:59:59';
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