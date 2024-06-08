import React from "react";
import '../styles/card.css';
import '../styles/custom.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Carousel_Card(props) {

    return(

      <Row>
        <Col sm={12}>
          <div className="carousel-card">
            <img className="card-img-top" src={props.img} alt="Card image cap" style={{maxHeight:220, width: '100%', objectFit: 'cover'}}/>
              <div className="carousel-card-body">
                <h2 className="card-title"> {props.special}</h2>
                <p className="card-text"> {props.price}</p>
                <p className="card-text" style={{fontSize:14}}> {props.description}</p>
              </div>
            </div>
          </Col>
        </Row>
    )
}


export default Carousel_Card;