import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
import { getUsers, removeUser, isPasswordStrong, validateEmail} from '../data/repository'; // Importing updateUser, verifyEmail, and isPasswordStrong functions from repository
import { findUser, getUser, verifyUser, verifyEmail, updateUser, updateEmail, updatePassword, deleteUser } from '../data/repository_express';
import { Container, Button, Form, Row, Col, InputGroup} from 'react-bootstrap';
import '../styles/formInput.css'
import { useNavigate, Link } from "react-router-dom";
import profile from '../assets/profile.png'

function Profile() {
  console.log("Re-rendered");
  const [user, cartState, loginUser, logoutUser] = useContext(UserContext);
  const [editMode, setEditMode] = useState(false); // State variable to track edit mode
  const [formData, setFormData] = useState({}); // State variable to store form data
  const [errors, setErrors] = useState({}); // State variable to store error message
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    const setUserEffect = async () => {
      setUserDetails(await findUser(user.id));
      setFormData({ ...formData, ["id"]: user.id });
    }
    setUserEffect();
    console.log(formData);
  }, []);

  // Function to handle form input changes
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    // Update formData state only if value is not empty
      setFormData({ ...formData, [name]: value });
      if(!!errors[name])
      setErrors({
        ...errors,
        [name]:null
    })
    
  };
  

  const validateForm = async () => {
    const {email, password} = formData
    const newErrors = {}
    console.log(formData)
    
    if (email === '') {
      newErrors.email = 'Please enter an email'
      return newErrors;
    }
    const existingEmail = await verifyEmail(email);
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter an email in the correct format'
    }
    else if (!existingEmail) {
      newErrors.email = "Email already exists"
    }

    if (password === ''){
      newErrors.password = 'Please enter a password'
    }
    else if (password && !isPasswordStrong(password)) {
      newErrors.password = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long."
    }
    return newErrors
  }

  // Function to handle form submission for editing user profile
  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    const formErrors = await validateForm();
    if(Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setValidated(false);
    }else{
      console.log('submitted form')
      setValidated(true);

      const { email, password } = formData;
      try {
        if (email) {
          await updateEmail(formData);
        }
      } catch (error) {
        setErrors(error.response.data);
        console.log(error);
        setValidated(false);
        return
      }
      
      try {
        if (password) {
          await updatePassword(formData);
        }
      } catch (error) {
        setErrors(error.response.data);
        console.log(error);
        setValidated(false);
        return
      }
      
      
      setUserDetails(await findUser(user.id));
      alert("Your account has been successfully changed.")
    }

    
  };

  // Function to handle deletion of user account
  const handleDelete = async () => {
    console.log('Delete button clicked');
    await deleteUser(user.id);
    logoutUser();
    // Navigate to the login page.
    navigate("/login");
    alert("Your account has been successfully deleted.");
  };

  // Function to render edit form
  const renderEditForm = () => {
    return ( 
      <Form noValidate validated={validated} onSubmit={handleProfileSubmit} className='text-left inter'>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            name='username'
            type="text"
            placeholder="First name"
            defaultValue= {userDetails.username}
            value = {formData.username}
            onChange={handleInputChange}
            readOnly
            disabled
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
        
        <Form.Group as={Col} md="6" controlId="dateJoined">
          <Form.Label>Date Joined</Form.Label>
          <Form.Control 
          type="text" 
          placeholder="DOB" 
          defaultValue={userDetails.dateCreated}
          readOnly
          required 
          disabled/>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
          name="password"
          type="password" 
          placeholder="Password" 
          defaultValue={userDetails.password}
          value={formData.password}
          onChange={handleInputChange}
          isInvalid={!!errors.password}
          // required 
          />
          <Form.Control.Feedback type="invalid" className='red'>
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            name='email'
            type="email"
            value={formData.email}
            placeholder="abc@gmail.com"
            defaultValue={userDetails.email}
            onChange={handleInputChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type = 'invalid' className='red'>
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
    
      </Row>
      <Button type="submit">Submit form</Button>
      <Button variant="success" className='donebtn' onClick={() =>setEditMode(false)}>Done</Button>
    </Form>
    
    );
  };

  return (
   
    <Container>
      
      <div className="card text-left center-container inter" style={{width: "40rem", marginTop:"300px"}}> <img className='profileimg' src={profile}/>
        <div className="card-header"> 
        <Form>
      <Form.Group as={Row} className="mb-1" controlId="username">
        <Form.Label column sm="4">
          Username:
        </Form.Label>
        <Col sm="8">
          <Form.Control plaintext readOnly defaultValue={userDetails.username} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-1" controlId="email">
        <Form.Label column sm="4">
          Email:
        </Form.Label>
        <Col sm="8">
          <Form.Control plaintext readOnly defaultValue={userDetails.email} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-1" controlId="dateJoined">
        <Form.Label column sm="4">
          Date joined:
        </Form.Label>
        <Col sm="8">
          <Form.Control plaintext readOnly defaultValue={userDetails.dateCreated} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-1" controlId="password">
        <Form.Label column sm="4">
          Password:
        </Form.Label>
        <Col sm="8">
          <Form.Control type='password' plaintext readOnly defaultValue={userDetails.dateCreated} />
        </Col>
      </Form.Group>
      
      </Form>
        </div>
        <div className="card-body">
        {!editMode && (<Button type="submit" variant="danger"  onClick={() =>handleDelete()}>Delete</Button>)}
        {editMode && renderEditForm()}
        {!editMode && (<Button type="submit" variant="success" className='editbtn' onClick={() =>setEditMode(true)}>Edit</Button>)}
      
        
        
        </div>
      </div>
    </Container>
    
  );
}

export default Profile;
