import React, { useState, useEffect } from 'react';
import Nvbar from '../common/components/nvbar.js'
import JobList from '../common/components/JobList.js';
import { LoginProvider } from '../common/contexts/LoginContext';

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
