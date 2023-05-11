import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function DeleteMessageModal({show, handleClose, user, job_id}){
    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header>
                    <Modal.Title>Delete Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Job ID:</b> {job_id}
                    <br/>
                    <b>Owner:</b> {user}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}