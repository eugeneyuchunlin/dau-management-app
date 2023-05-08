import Nvbar from "../common/components/nvbar"
import { LoginProvider } from "../common/contexts/LoginContext"

import { Col, Row, Container } from "react-bootstrap";
import HistoryTable from "../common/components/HistoryTable";

import db from '../database'

export default function HistoryPage({data}) {



    return (
        <>
            <LoginProvider>
                <Nvbar />
            </LoginProvider>
            <Container
                fluid="xl"
                style={{
                    marginTop: "50px",
                    marginBottom: "50px",
                }}
            >
                   <Row>
                    <Col>
                        <HistoryTable data={data}/>
                    </Col>
                   </Row>

            </Container>
        </>
    )
}

export async function getStaticProps(context) {
    const data = await getDataFromDatabase();
    return {
        props: {
            data
        }
    };
}

async function getDataFromDatabase(){
    const sql = `SELECT * from test_service_stats;`
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err.message);
                reject(err);
            }
            // console.log(rows);
            resolve(rows);
        })
    })
}
