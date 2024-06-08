import { Container, Row, Button, Col } from 'react-bootstrap';
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyUser, isPasswordStrong, validateEmail } from "../data/repository";
import { addUser, createUser, verifyUsername, verifyEmail} from "../data/repository_express";
import '../styles/formInput.css';

function SignUp(props) {
    const [fields, setFields] = useState({ username: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
  
    // Generic change handler.
    const handleInputChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
  
      // Copy fields.
      const temp = { ...fields };
  
      // Update field and state.
      temp[name] = value;
      setFields(temp);
    }
  
    const handleSignUpSubmit = async (event) => {
      event.preventDefault();
      
      // Perform Username validation
      const existingUsername = await verifyUsername(fields.username);
      console.log(existingUsername);
      if (!existingUsername) {
        setErrorMessage("Username already exists");
        return;
      }
      
      // Perform email validation
      
      if (!validateEmail(fields.email)) {
        setErrorMessage("Invalid email format");
        return;
      }

      const existingEmail = await verifyEmail(fields.email);
      // Perform email verification
      if (!existingEmail) {
        setErrorMessage("Email already exists");
        return;
      }

      // Perform password strength validation
      if (!isPasswordStrong(fields.password)) {
        setErrorMessage("Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character");
        return;
      }
      

        const trimmedFields = trimFields();
      // Create user.
      try {
        const newUser = await createUser(fields);
        // login user
      props.loginUser(newUser.username, newUser.user_id);
      } catch (error) {
        setErrorMessage(error.response.data.password);
        return;
      }
        
        // login user
        //props.loginUser(fields.username);
        
        //setFields({ username: "", email: "", password: "" });

        console.log("user created");
        // For now, let's just navigate to the home page
        navigate("/");
        return
    }

    const trimFields = () => {
      const trimmedFields = { };
      Object.keys(fields).map(key => trimmedFields[key] = fields[key].trim());
      setFields(trimmedFields);
  
      return trimmedFields;
    };
  
    return (
      <Container >
        <Row style={{marginTop: "50px"}}>
  
          <Col  xs={6}>
            <h1>Signing Up</h1>
            <hr/> 
            <form onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="control-label">Username</label>
                <input name="username" id="username" className="form-control"
                  value={fields.username} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="control-label">Email</label>
                <input type="email" name="email" id="email" className="form-control"
                  value={fields.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="control-label">Password</label>
                <input type="password" name="password" id="password" className="form-control"
                  value={fields.password} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input type="submit" className="btn btn-primary green-button" value="Sign Up" style={{marginTop: '1rem'}} />
              </div>
              {errorMessage !== null &&
                <div className="form-group">
                  <span className="red">{errorMessage}</span>
                </div>
              }
            </form>
          </Col>

        </Row>
      </Container>
    );
  }
  
  export default SignUp;
