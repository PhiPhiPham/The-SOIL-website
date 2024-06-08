import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { UserContext } from '../App.js';
import {initSpecials} from '../data/repository.js';
import useProducts from '../data/useProducts.js';
import '../styles/custom.css';

// NPM react-multi-carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Carousel_Card from '../components/carousel_card.js';


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
};

function Home(props) {
  //Remove later, for testing right now
  const [user, loginUser, logoutUser] = useContext(UserContext)
  const [products] = useProducts();
  const specials = products.filter((product) => {
    return product.is_special
  })
  console.log(specials);
  return (
    <Container fluid>
      
      {/* Intro home text */}
      <div className='text-middle'>
      <Row style={{marginTop: "150px"}}>
        <p className='newsreader bigger-text' style={{textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}> We're <i>farmers</i>, <i>purveyors</i> and <i>eaters</i> of organically grown food.</p>
      </Row>
      <Link to="/Store">
      <button type="button">Browse our shop</button>
      </Link>
      </div>

      <div className='text-middle'>
      <Row style={{marginTop: "180px"}}>
        <p className='newsreader bigger-text' style={{textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}> View our <i style={{color:'#426B1F'}}>specials</i>, of the week!</p>
      </Row>
      </div>


      <div style={{padding:50}}>
      {/* Cards for NPM carousel */}

      <Carousel responsive={responsive}>

        {specials.map((item) => {
          return (
            <Carousel_Card special={item.special} price={item.price} 
            description={item.description} 
            img={item.image}/>
          )
        })}
        </Carousel>
      </div>

      <div style={{padding:50}}>
        <div style={{paddingLeft:20}}>
          <div className="row">
            <div className="col-md-6">
              <div style={{ display: 'inline-block'}}>
                <img src="garden-vegetables.png" className="rounded" style={{width:"600px", height:"350px"}}/>
              </div>
            </div>
            {/* FIX BELOW. WIDTH */}
            <div className="card" style={{width:"500px", height:"350px"}}> 
              <div className="card-body">
                <h2 className="card-title">Grow your own backyard garden!</h2>
                <p className="card-text">Here at SOIL we offer the resources to help you build
                your very own garden at home. No matter the size and scope we have something to accomodate
                your needs.</p>
                <button type="button">Find out more</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      
      
   
    </Container>

    
  );
}

export default Home;