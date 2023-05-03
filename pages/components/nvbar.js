import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext } from 'react';
import LoginContext from '../contexts/LoginContext';

// keep in mind
// the nvbar will be re-render when the context is changed
// TODO: prevent re-rendering
export default function Nvbar({data}) {

  const { username, isLoggedIn, logout} = useContext(LoginContext);
  
  const onClickHandler = () => {
    logout();
  }

  return (
    <>
      <Navbar bg="light" variant="light" >
        <Container>
          <Navbar.Brand href="/">Project Name</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/jobs">Job List</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <Navbar.Text>
                Username : {username} <Nav.Link href="#" onClick={onClickHandler}>Logout</Nav.Link>
              </Navbar.Text>
            ) : (<>
              <Navbar.Text>
                <a href="/login">Login</a>
            </Navbar.Text>
            </>)}
          
        </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
