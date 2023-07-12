import Nvbar from "../common/components/nvbar"
import { LoginProvider } from "../common/contexts/LoginContext"

import { Col, Row, Container } from "react-bootstrap";
import HistoryTable from "../common/components/HistoryTable";
import Footer from '../common/components/Footer'
import { TABLE_NAME } from "../common/constants/constant";

import db from '../database'

export default function HistoryPage({data}) {



    return (
        <>
            <LoginProvider>
                <Nvbar />
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
                        <HistoryTable data={data}/>
                    </Col>
                   </Row>

            </Container>
            <Footer />
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const data = await getDataFromDatabase();
    return {
        props: {
            data
        }
    };
}

async function getDataFromDatabase(){
    const sql = `SELECT * from ${TABLE_NAME};`
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err.message);
                reject(err);
            }
            resolve(rows);
        })
    })
}
