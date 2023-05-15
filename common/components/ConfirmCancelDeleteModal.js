import React from 'react';
import Modal from 'react-bootstrap/Modal';

export function ModalContent({text, job_id, user}){
    return (<>
        <Modal.Body>
            {text}
            <br/>
            <br/>
            <b>Job ID:</b> {job_id}
            <br/>
            <b>Owner:</b> {user}
        </Modal.Body>
    </>)
}

export default function ConfirmDeleteModal({children, show, handleClose, handleOperation}) {

    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                {children} 
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleClose}>No</button>
                    <button className="btn btn-danger" onClick={handleOperation}>Yes</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}