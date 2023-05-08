import React from 'react';
import Modal from 'react-bootstrap/Modal';

import LoginForm from './LoginForm';


export default function LoginModal({show, handleClose}) {


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