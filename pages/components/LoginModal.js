import React from 'react';
import Modal from 'react-bootstrap/Modal';

import LoginForm from './LoginForm';
import { useContext } from 'react';
import LoginContext from '../contexts/LoginContext';


export default function LoginModal({show, handleClose}) {

    const { username, isLoggedIn, logout} = useContext(LoginContext);
    
    const onClickHandler = () => {
        logout();
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm />
                </Modal.Body>
            </Modal>
        </>
    )

}