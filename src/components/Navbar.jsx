// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Ensure this import is present

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/auth'); // Redirect to auth page after logout
  };

  return (
    <nav className='navbar-container'> {/* Changed 'container' to 'navbar-container' */}
      <Link to="/" className='navbar-logo'> {/* Changed 'logo' to 'navbar-logo' */}
        Decision Compass
      </Link>
      <div className='navbar-links'> {/* Added 'navbar-links' class */}
        {isAuthenticated ? (
          <>
            {/* Added a span for "Hello, Username" with a text class */}
            <span className='navbar-link text-username'>Hello, {user?.username}</span> 
            <Link to="/decisions" className='navbar-link'> {/* Added 'navbar-link' class */}
              My Decisions
            </Link>
            {/* THIS IS THE LINK ADDED FOR STEP 11 */}
            <Link to="/create-decision" className='navbar-link'> {/* Added 'navbar-link' class */}
              Create New
            </Link>
            <button
              onClick={handleLogout} // Use handleLogout function
              className='navbar-button' // Added 'navbar-button' class
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className='navbar-link'> {/* Added 'navbar-link' class */}
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;