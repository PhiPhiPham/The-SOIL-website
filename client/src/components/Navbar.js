import React from "react";
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../App';
import '../styles/navbar.css'

function Navbar() {

  // This line is using the useContext hook to access the UserContext, which provides information about the logged-in user.
  const [user, cartState, loginUser, logoutUser] = useContext(UserContext)
  return (
    // This div contains the navigation bar elements.
    <div className="topnav sticky-top">
      <Link className='newsreader' style={{color:'#426B1F', fontSize:32, fontWeight:"bold"}} to="/">SOIL</Link>
      
      {/* This conditional rendering checks if a user is logged in. If so, it displays a welcome message with the username. */}
      {user !== null &&
        <span className="welcome">Welcome,  ‍<i>{user.username}</i></span>
      }
      
      <div className="topnav-right">
        {/* This conditional rendering checks if a user is logged in. If so, it displays additional navigation links. */}
        {user !== null &&
        <>
        
          <Link to="/profile">Profile</Link>
          <Link to="/reviews">Reviews</Link>
        </>
        }

        {/* This navigation link is always present, regardless of whether a user is logged in. */}
        
        {/* This conditional rendering checks if a user is logged in. If not, it displays a login link. If logged in, it displays a logout link. */}
        {user === null ? 
        <>
        <Link to="/login">Login</Link>
        </>
        :
        <>
        {/* This Link represents the logout functionality. When clicked, it calls the logoutUser function to log the user out. */}
        <Link to="/login" onClick={() => logoutUser()}>Logout</Link>
        </>
        }

      </div>
    </div>
  )
}

export default Navbar;
