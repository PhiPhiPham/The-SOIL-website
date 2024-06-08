import React, { useState, useEffect, useContext, useRef } from 'react';
import useCart from '../data/useCart';
import useProducts from '../data/useProducts';
import { UserContext } from '../App';
import { Container, Row, Col, Card, Button, Modal, Form, ToggleButton, Table } from 'react-bootstrap';
import "../styles/store.css"
function Store() {

// Initialisation functions
 
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardError, setCardError] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [checked, setChecked] = useState(false);
  const [user, cartState, loginUser, logoutUser] = useContext(UserContext)

  const [cart, cartLoading, cartProductsAdd, cartProductsIncrement, cartProductsDelete] = useCart(user.id);
  const [products, productsLoading] = useProducts();
  console.log(cart);

  // Modal visibilities
  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };
  const toggleCheckoutModal = () => { 
    setShowCheckoutModal(!showCheckoutModal);
  };

  // Calculates total for all items and their quantity in cart and returns number to 2 decimal places
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }

  // Toggle cart and checkout modals from buttons
  const handleCheckout = () => {
    toggleCartModal(); 
    toggleCheckoutModal();
  };

  // Payment summary event
  const handlePaymentSubmit = (ev) => {
    ev.preventDefault();
    if (validateCreditCard()) {
      const summary = `Thank you for your purchase, ${nameOnCard}! Your total amount charged is $${calculateTotal()}.`;
      setSummaryContent(summary);
      toggleSummaryModal(); 
    }
  };
   const toggleSummaryModal = () => {
    setShowSummaryModal(!showSummaryModal);
  };

  // Simple credit card validation
  const validateCreditCard = () => {
    if (cardNumber.trim().length !== 16) {
      setCardError('Not a valid credit card number. Must be 16 digits.');
      return false;
    }
    if (!expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setCardError('Not a valid expiration date (MM/YY).');
      return false;
    }
    if (cvv.trim().length !== 3) {
      setCardError('Not a valid 3-digit CVV.');
      return false;
    }
    if (nameOnCard.length <= 0) {
        setCardError('Please enter a name.');
        return false;
      }
    setCardError('');
    return true;
  };

  return (
    <Container>

      {/* Specials Button and Open Cart Button */}
      <Button variant="info" style={{float:'right', backgroundColor:'#ADD8E6', borderColor:'#ADD8E6'}} onClick={toggleCartModal} name={"Open Cart"}>Open Cart</Button>
      <ToggleButton
        className="mb-2"
        id="toggle-check"
        type="checkbox"
        variant="outline-primary"
        checked={checked}
        value="1"
        onChange={(e) => setChecked(e.currentTarget.checked)}>
          Specials
      </ToggleButton>

      {/* Product cards */}  
      <Row>
          {/* Conditional rendering if products data has been fetched from the database */}
          {productsLoading ? (<h1>Loading</h1>)
          : 
          products.map((product) => {

            if (product.is_special && checked) return null;
      
            return (
              <React.Fragment key={product.product_id}>
                <Col xs={12} md={4}>
                <Card key={product.product_id} style={{ marginBottom: '20px' }} aria-label={"product"}>
                    <Card.Img variant="top" src={product.image} style={{ height: '200px', objectFit: 'cover' }} alt={product.name}/>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                                <Card.Text>Price: ${(product.price).toFixed(2)}</Card.Text>
                                    <Button variant="primary" style={{backgroundColor:'#426B1F', borderColor:'#426B1F'}} onClick={() => {cartProductsAdd(product.product_id)}}>Add to Cart</Button>
                        </Card.Body>
                </Card>
                </Col>
            </React.Fragment>
      
          )})}
      </Row>
        
      {/* Modal that shows up when you press "Open Cart" */}
      <Modal show={showCartModal} onHide={toggleCartModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>

        {cartLoading ? (<h2>Loading Cart</h2>) 
        :
            <Modal.Body>
              <Table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 && cart.map(product => {
                    return (
                      <React.Fragment key={product.product_id}>
                        <tr>
                          <td><img src={product.image} width="100" height="100"></img></td>
                          <td><p>{product.name}</p></td>
                          <td><p>{product.price}</p></td>
                          <td>
                            <p>
                            <Button variant="danger" onClick={() => {cartProductsIncrement(product.product_id, -1)}}>-</Button>
                            {product.quantity}
                            <Button variant="primary" onClick={() => {cartProductsIncrement(product.product_id)}}>+</Button>
                            <Button variant="danger" onClick={() => {cartProductsDelete(product.product_id)}}>x</Button>
                            </p>
                          </td>
                        </tr>
                      </React.Fragment>
                  )})}
                </tbody>
              </Table>
              <h3>Total: {calculateTotal(cart)}</h3>

            </Modal.Body>
          }

        <Modal.Footer>
        <Button variant="primary" onClick={handleCheckout}>Checkout</Button>
        <Button variant="secondary" onClick={toggleCartModal}>Close</Button>
        </Modal.Footer>
        </Modal>
                    
        {/* Show checkout */}
        <Modal show={showCheckoutModal} onHide={toggleCheckoutModal}>
            <Modal.Header>
                <Modal.Title>Select Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handlePaymentSubmit}>
                  <Form.Group id="formCardNumber">
                    <Form.Label>Credit Card Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter card number" value={cardNumber} onChange={(ev) => setCardNumber(ev.target.value)} maxLength="16" />
                  </Form.Group>
                  <Form.Group id="formExpirationDate">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control type="text" placeholder="MM/YY" value={expirationDate} onChange={(ev) => setExpirationDate(ev.target.value)} maxLength="5"/>
                  </Form.Group>
                  <Form.Group id="formCVV">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="text" placeholder="CVV" value={cvv} onChange={(ev) => setCVV(ev.target.value)} maxLength="3" />
                  </Form.Group>
                  <Form.Group id="formNameOnCard">
                    <Form.Label>Name on Card</Form.Label>
                    <Form.Control type="text" placeholder="Name on Card" value={nameOnCard} onChange={(ev) => setNameOnCard(ev.target.value)} />
                  </Form.Group>
                    {cardError && <p className="text-danger">{cardError}</p>}
                    <Button variant="primary" type="submit">Submit</Button>
                    <Button variant="secondary" onClick={toggleCheckoutModal}>Close</Button>
                </Form>
            </Modal.Body>
        </Modal>
        
        {/* Show summary */}
        <Modal show={showSummaryModal} onHide={toggleSummaryModal}>
            <Modal.Header closeButton>
                <Modal.Title>Payment Summary</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <p>{summaryContent}</p>
                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={toggleSummaryModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    </Container>
    
  );
  
}

export default Store;






