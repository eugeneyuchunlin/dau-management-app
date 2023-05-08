import React from 'react'
import Table from 'react-bootstrap/Table'

export default function HistoryTable({data}){
    return(
        <Table striped bordered>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Job Id</th>
                    <th>User</th>
                    <th>Job Status</th>
                    <th>solve time</th>
                    <th>Start time</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((job, index) => {
                    return (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{job.job_id}</td>
                            <td>{job.username}</td>
                            <td>{job.status}</td>
                            <td>{job.computation_time_ms}</td>
                            <td>{job.start_time}</td>
                        </tr>
                    )
                })}
            </tbody> 
        </Table>
    );
}