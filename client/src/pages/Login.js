import { Container, Row, Button, Col, form, Card } from 'react-bootstrap';
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyUser, findUser, getUser } from "../data/repository_express";
import '../styles/button.css'

function Login(props) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Generic change handler.
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Update field and state.
    setFields({...fields, [name]:value});
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    
    const verified = await verifyUser(fields.email, fields.password);

    // If verified login the user.
    if(verified !== false) {
      // Navigate to the home page.
      //For some reason I have to do this because verified.username into the funciton doesn't work
      const username = verified.username;
      const user_id = verified.user_id;
      props.loginUser(username, user_id);
      navigate("/");
      alert("You have successfully logged in")
      return;
    }

    // Reset password field to blank.
    const temp = { ...fields };
    temp.password = "";
    setFields(temp);

    // Set error message.
    setErrorMessage("Email and / or password invalid, please try again.");
  }






  return (
    <Container >
      <div class="card ">
      <div class="card-header text-center">
        Login
      </div>
      <div class="card-body">
        <form onSubmit={handleLoginSubmit}>
          <div class="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input name = 'email' type="email" class="form-control" id="email" aria-describedby="emailHelp" value={fields.email} onChange={handleInputChange}/>
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div class="mb-3">
            <label htmlFor="password" class="form-label">Password</label>
            <input type="password" name="password" class="form-control" id="password"  value={fields.password} onChange={handleInputChange}/>
          </div>
          <button type="submit" className="btn btn-primary green-button">Submit</button>
          {errorMessage !== null &&
              <div className="form-group">
                <span className="text-danger">{errorMessage}</span>
              </div>
            }
      </form>
      <Link to="/SignUp" className="btn btn-secondary" style={{ float: 'right' }}>Sign Up</Link>
      </div>
      </div>
    </Container>
  );
}

export default Login;
