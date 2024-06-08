// Importing CSS files & imgs for styling.
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import footerimg from './assets/footerimg.png'

// NPM react-multi-carousel
import 'react-multi-carousel/lib/styles.css';

// Importing necessary components and hooks from React Router.
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { createContext, useEffect, useState } from 'react';

// Importing components for rendering different pages.
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Forum from "./pages/Forum";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import ReviewForm from './pages/Reviews.js';
import { Card } from 'react-bootstrap';
import { printUsers } from './data/repository_express.js';

// Importing functions for managing user data.
import { setUserLocal, getUser, removeUser } from './data/repository_express.js';

// Creating a context for managing user data throughout the application.
export const UserContext = createContext();



// Main component App representing the entire application.
function App() {

  const [user, setUser] = useState(getUser());

  const loginUser = (username, user_id, cart_id) => {

    // Set logged-in user in localstorage to the username and user_id retrieved from validating login from the database
    setUserLocal(username, user_id);
    setUser(getUser()); // This is just to rerender user state
  }

  const logoutUser = () => {
    removeUser();
    setUser(getUser());
    return null;
  }

  return (
    <div className="App">
       {/* Head section for importing Google Fonts */}
      <header>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap')
        </style>
        </header>
         {/* Providing functions and variables to all children using UserContext */}
        <UserContext.Provider value={[user, loginUser, logoutUser]}>
          <section className="App-header" style={{margin:0}}>
            <Router>
              <Navbar /> 
                <main role="main" className='content'>
                  <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/forum" element={<Forum/>}/>
                    <Route path="/login" element={<Login loginUser={loginUser}/>}/>
                    <Route path="/signup" element={<SignUp loginUser={loginUser}/>} />
                    <Route path="/profile" element={<Profile logoutUser={logoutUser}/>}/>
                    <Route path="/store" element={<Store/>}/>
                    <Route path="/reviews" element={<ReviewForm/>} />
                  </Routes>
                </main>
                <img  src={footerimg} alt="footer-banner"/>
                <footer class="footer">
                <p>SOIL Limited</p>
                <p>Contact us: <a href="mailto:info@soillimited.com">info@soillimited.com</a></p>
                <p>Phone: +61 456 7890</p>
                <p>Address: 170 Monaghans Lane, Clydebank VIC 3851</p>
                  </footer>
            </Router>
          </section>
        </UserContext.Provider>
    </div>
  );
}

export default App;
