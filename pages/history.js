import Nvbar from "../common/components/nvbar"
import { LoginProvider } from "../common/contexts/LoginContext"

import { Col, Row, Container } from "react-bootstrap";
import HistoryTable from "../common/components/HistoryTable";
import Footer from '../common/components/Footer'
import { TABLE_NAME } from "../common/constants/constant";
import db from '../database'
import { useEffect, useState } from "react";
import MonthStatistic from "../common/components/MonthStatistic";

export default function HistoryPage({data}) {

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [record, setRecord] = useState(null);

    useEffect(()=>{
        if(data.length !== 0){
            setYear(data[data.length-1].start_time.split('-')[0]);
            setMonth(data[data.length-1].start_time.split('-')[1]);
        }
    })


    const changeMonth = async (time) => {
        setYear(time.split('-')[0]);
        setMonth(time.split('-')[1]);
    }

    return (
        <>
            <LoginProvider>
                <Nvbar month={true} >
                    <MonthStatistic data={data} onClick={changeMonth} />
                </Nvbar> 
            </LoginProvider>
            <div style={{
                flexGrow : "1"
            }}>
            <Container
                fluid="xl"
                style={{
                    marginTop: "50px",
                    marginBottom: "50px",
                }}
            >
                   <Row>
                    <Col>
                        <HistoryTable year={year} month={month}/>
                    </Col>
                   </Row>

            </Container>
            <Footer />
            </div>
        </>
    )
}

export async function getStaticProps(context) {
    const data = await getMonthDataFromDatabase();
    return {
        props: {
            data
        }
    };
}


async function getMonthDataFromDatabase() {
    const sql = `SELECT strftime('%Y-%m', start_time) AS start_time 
                 FROM ${TABLE_NAME} 
                 GROUP BY strftime('%Y-%m', start_time);`;
  
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
  
        resolve(rows);
      });
    });
  }