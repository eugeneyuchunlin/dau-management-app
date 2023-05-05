import React, { useState, useEffect } from 'react';
import Nvbar from './components/nvbar.js'
import JobList from './components/JobList.js';
import { LoginProvider } from './contexts/LoginContext';

import { Container, Row, Col } from 'react-bootstrap';




export default function JobsPage() {


    return (
        <>
            <LoginProvider>
                <Nvbar />
                <Container style={{
                    marginTop: "50px",
                    marginBottom: "50px",
                }}>
                    <Row>
                        <Col>
                            <JobList/>
                        </Col>
                    </Row>
                </Container>
            </LoginProvider>

        </>
    )

}
