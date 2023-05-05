import React, { useContext, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginContext from '../contexts/LoginContext';
import LoginModal from './LoginModal';

// keep in mind
// the nvbar will be re-render when the context is changed
// TODO: prevent re-rendering
export default function Nvbar({data}) {

  const { username, isLoggedIn, logout} = useContext(LoginContext);
  const [ show, setShow ]= useState(false);

  const onLogoutClickHandler = () => {
    logout();
  }

  
  const showLoginModalHandler = () => setShow(true);
  const hideLoginModalHandler = () => setShow(false);

  return (
    <>
      <Navbar bg="light" variant="light" >
        <Container>
          <Navbar.Brand href="/">Project Name</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/jobs">Alive Job List</Nav.Link>
            <Nav.Link href="/history">History</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <Navbar.Text>
                Username : {username} <Nav.Link href="#" onClick={onLogoutClickHandler}>Logout</Nav.Link>
              </Navbar.Text>
            ) : (<>
              <Navbar.Text>
                <a href="#" onClick={showLoginModalHandler}>Login</a>
            </Navbar.Text>
            </>)}
          
        </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginModal show={show} handleClose={hideLoginModalHandler} />
    </>
  );
}
