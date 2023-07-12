import React, { useContext, useState } from 'react'
import Container from 'react-bootstrap/Container';
import { Offcanvas } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginContext from '../contexts/LoginContext';
import LoginModal from './LoginModal';
import styles from '../../styles/Nvbar.module.css'
import { OffcanvasProvider } from '../contexts/OffcanvasContext';

// keep in mind
// the nvbar will be re-render when the context is changed
// TODO: prevent re-rendering
export default function Nvbar({month, children}) {

  const { username, isLoggedIn, logout} = useContext(LoginContext);
  const [ showModal, setShowModal ]= useState(false);
  const [ showOffcanvas, setShowOffcanvas ] = useState(false);

  const onLogoutClickHandler = () => {
    logout();
  }

  
  const showLoginModalHandler = () => setShowModal(true);
  const hideLoginModalHandler = () => setShowModal(false);
  

  // const showOffcanvasHandler = () => setShowOffcanvas(true);
  // const hideOffcanvasHandler = () => setShowOffcanvas(false);
  console.log(month)
  return (
    <>
      <Navbar bg="light" variant="light" className={styles.nvbar}>
        <Container>
          <Navbar.Brand href="/">DAU Management App</Navbar.Brand>
          <Nav className="me-auto">
            { month ? <Nav.Link onClick={()=>setShowOffcanvas(true)}>Month</Nav.Link> : <></>}
            <Nav.Link href="/jobs">Alive Job List</Nav.Link>
            <Nav.Link href="/history">History</Nav.Link>
            <Nav.Link href="https://github.com/yuchun1214/dau-management-app/blob/e88c43cc9104e33ef33874c2b667abc6fb5c25bd/README.md">Doc</Nav.Link>
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

      <Offcanvas show={showOffcanvas} onHide={()=>{setShowOffcanvas(false)}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Month</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <hr/>
          <OffcanvasProvider onHide={()=>setShowOffcanvas(false)}>
            {children}
          </OffcanvasProvider>
          {/* {offcanvas_body} */}
        </Offcanvas.Body>
      </Offcanvas>      

      <LoginModal show={showModal} handleClose={hideLoginModalHandler} />
    </>
  );
}
