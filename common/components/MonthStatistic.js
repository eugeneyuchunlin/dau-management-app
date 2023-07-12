import {Col, Container, Row, Badge} from 'react-bootstrap';
import { use, useEffect, useState } from 'react';
import MonthBlock from './MonthBlock';

import styles from '../../styles/MonthStatistic.module.css'

export default function MonthStatistic({data, onClick}) {

    const [bgs, setBgs] = useState([]);

    useEffect(()=>{
        if(data.length !== 0){
            let temp = [];
            for(let i = 0; i < data.length; i++){
                 if(900 - data[i].monthly_computation_time < 300){
                    temp.push('primary');
                 }else if(900 - data[i].monthly_computation_time < 600){
                    temp.push('warning');
                 }else{
                    temp.push('danger');
                 }
            }
            setBgs(temp);
        }
    }, [data])

  return (<>
    <Container fluid>
        {data.map((item, index) =>(
            <Row key = {index}>
                <MonthBlock onClick={onClick} item_name={item.start_time}>
                    {item.monthly_computation_time ? 
                        (<Badge bg={bgs[index]}>
                            {item.monthly_computation_time}
                        </Badge>): <></>
                    }
                </MonthBlock>
            </Row>
        ))
        }
    </Container>
    </>);
}
