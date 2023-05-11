import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function ConfirmDeleteModal({show, handleClose, handleDelete, user, job_id}) {



    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to delete this job?
                    <br/>
                    <br/>
                    <b>Job ID:</b> {job_id}
                    <br/>
                    <b>Owner:</b> {user}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}