import React, { useState, useEffect } from 'react';
import Nvbar from '../common/components/nvbar.js'
import JobList from '../common/components/JobList.js';
import { LoginProvider } from '../common/contexts/LoginContext';

import { Container, Row, Col } from 'react-bootstrap';
import Footer from '../common/components/Footer'



export default function JobsPage() {


    return (
        <>
            <LoginProvider>
                <Nvbar />
                <div style={{
                    flexGrow : "1"
                }}>
                    <Container style={{
                        marginTop: "50px",
                        marginBottom: "50px",
                        minHeight: "75vh"
                    }}>
                        <Row>
                            <Col>
                                <JobList/>
                            </Col>
                        </Row>
                    </Container>

                <Footer />
                </div>
            </LoginProvider>
        </>
    )

}
