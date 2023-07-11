import {Col, Container, Row} from 'react-bootstrap';
import MonthBlock from './MonthBlock';

export default function MonthStatistic({data, onClick}) {
  console.log(data);
  return (<>
    <Container fluid>
        {data.map((item, index) =>(
            <Row key = {index}>
                <MonthBlock onClick={onClick} item_name={item.start_time}>
                    {item.monthly_computation_time}
                </MonthBlock>
            </Row>
        ))
        }
    </Container>
    </>);
}
