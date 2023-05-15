import React, { useEffect, useState, useContext } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import LoginContext, { LoginProvider } from '../contexts/LoginContext';
import ConfirmDeleteModal, { ModalContent } from './ConfirmCancelDeleteModal';
import DeleteMessageModal from './DeleteSuccessfullyModal';

function Entry({ index, data, isLoggedIn }) {

    const [isVisiable, setIsVisiable] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [jobStatus, setJobStatus] = useState(data.job_status);

    const deleteBtnHandler = () => setShowDeleteModal(true);
    const hideModalHandler = () => setShowDeleteModal(false);


    const deleteMessageModalCloseHandler = () => {
        setShowDeleteMessageModal(false);
        if(jobStatus === 'Deleted'){
            setIsVisiable(false);
        }
    }


    const deleteHandler = () => {
        setShowDeleteModal(false);

        const endpoint = '/api/jobs';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // should provide session key
            body: JSON.stringify({
                job_id: data.job_id
            })
        }

        fetch(endpoint, options).then((response) => response.json())
            .then((data) => {
                console.log(data) 
                setDeleteMessage(data.message)
                setJobStatus(data.status)
                setShowDeleteMessageModal(true);
            })
    }

    const cancelHandler = () => {
        setShowDeleteModal(false);
        console.log("Attempt to cancel the job");

        const endpoint = '/api/jobs/cancel'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                job_id: data.job_id
            })
        }
        fetch(endpoint, options).then((response) => response.json()).then((data) => {
            console.log(data);
            setJobStatus(data.status);
            if(data.status === 'Canceled'){
                setDeleteMessage("The job has been canceled successfully.");
            }else if(data.status === 'Done'){
                setDeleteMessage("The job is already done");
            }else{
                setDeleteMessage("The job has already started running");
            }
            setShowDeleteMessageModal(true);
        })
    }

    if (!isVisiable) {
        return null;
    }

    // console.log("line 43", isLoggedIn);

    return (
        <>
            <tr>
                <td>{index}</td>
                <td>{data.job_id}</td>
                <td>{data.username}</td>
                <td>{jobStatus}</td>
                <td>{data.start_time}</td>
                {
                    (() => {
                        if (isLoggedIn) {
                            // console.log("jobStatus : ", jobStatus)
                            if (jobStatus === 'Waiting') {
                                return <td><Button variant="outline-warning" onClick={deleteBtnHandler}>Cancel</Button></td>
                            }else {
                                return <td><Button variant="outline-danger" onClick={deleteBtnHandler}>Delete</Button></td>
                            }
                        }
                    })()
                }
            </tr>

            <ConfirmDeleteModal 
                show={showDeleteModal} 
                handleClose={hideModalHandler} 
                handleOperation={jobStatus === 'Waiting' ? cancelHandler : deleteHandler}
                Operation={jobStatus === 'Waiting' ? 'Cancel' : 'Delete'}
            >
                <ModalContent 
                    text={`Are you sure you want to ${jobStatus === 'Waiting' ? 'cancel' : 'delete'} this job?`} 
                    job_id={data.job_id} 
                    user={data.username}
                />
            </ConfirmDeleteModal>

            <DeleteMessageModal 
                show={showDeleteMessageModal} 
                message={deleteMessage} 
                handleClose={deleteMessageModalCloseHandler} 
                user={data.username} 
                job_id={data.job_id} 
            />
        </>
    )
}

export default function JobList({ data }) {

    // fetch data from /api/jobs
    const [jobs, setJobs] = useState(null);
    const [jobs_string, setJobsString] = useState(null);
    useEffect(() => {

        const fetchJobs = async () => {
            const endpoint = '/api/jobs';
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch(endpoint, options)
                .then((response) => response.json())
                .then((data) => {
                    console.log('data : ', data["job_status_list"])
                    setJobs(data["job_status_list"])
                    setJobsString(JSON.stringify(data))
                }).catch((err) => {
                    console.log('Error fetching jobs ', err)
                })
        }

        fetchJobs();
        return () => { };
        // const intervalId = setInterval(()=>{
        //     fetchJobs();
        // }, 100000)
        // return () => clearInterval(intervalId); 
    }, [])

    const { isLoggedIn } = useContext(LoginContext);


    return (
        <>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Job Id</th>
                        <th>User</th>
                        <th>Job Status</th>
                        <th>Start time</th>
                        {isLoggedIn && <th>Delete</th>}
                    </tr>
                </thead>
                <tbody>
                    {jobs && jobs.map((job, index) => {
                        return <Entry key={index} data={job} index={index} isLoggedIn={isLoggedIn} />

                    })}
                </tbody>
            </Table>
        </>
    );
}