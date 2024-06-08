import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';

function Forum(props) {
  return (
    <Container fluid>
      <Row style={{ marginTop: '0' }}>
        <p className='newsreader bigger-text'> Hi Ethan</p>
      </Row>
      <Button className='inter' variant="primary" style={{background:'#426B1F', padding: '10px 20px'}}><span className='smaller-text semi-bold'>Browse our shop</span></Button>{' '}
    </Container>
  );
}

export default Forum;