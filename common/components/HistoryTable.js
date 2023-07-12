import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import styles from '../../styles/History.module.css';

export default function HistoryTable({year, month }) {
    const [record, setRecord] = useState(null);
    const getData = async () => {
        const response = await fetch(`/api/record?year=${year}&month=${month}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json();
        return data
    }


    useEffect(()=> {
        if(year && month){
            getData().then((data) => {
                console.log(data)
                setRecord(data);
            })
        }
    }, [year, month])

  return (
    <div className={styles.tableContainer}>
      <Table>
        <thead className={styles._thead}>
          <tr>
            <th className={styles._th}>#</th>
            <th className={styles._th}>Job Id</th>
            <th className={styles._th}>User</th>
            <th className={styles._th}>Job Status</th>
            <th className={styles._th}>solve time</th>
            <th className={styles._th}>Start time</th>
          </tr>
        </thead>
        <tbody>
          {record &&
            record.map((job, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{job.job_id}</td>
                <td>{job.username}</td>
                <td>{job.status}</td>
                <td>{job.computation_time_ms}</td>
                <td>{job.start_time}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
