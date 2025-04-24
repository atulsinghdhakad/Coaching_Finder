import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import coachingFinderLogo from './images/logo-png (1).png';
import './Navbar.css'; // Make sure to import updated CSS

const Navbar = ({ setDarkMode, darkMode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    if (!darkMode) {
      document.body.classList.add('dark'); // Apply dark mode to body
    } else {
      document.body.classList.remove('dark'); // Remove dark mode from body
    }
  };

  if (loading) return null;

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
  <div className="flex justify-between items-center w-full">
    {/* Left: Logo */}
    <Link to="/" className="navbar-logo">
      <img src={coachingFinderLogo} alt="Logo" className="logo-img" />
      <span className="logo-text">Coaching Finder</span>
    </Link>

    {/* Middle: Filters/Search */}
    <div className="flex space-x-2 items-center w-2/5 ml-10">
      <input type="text" placeholder="Search Institutes" className="px-3 py-1 rounded-md w-full text-black" />
      <select className="px-2 py-1 rounded-md text-black">
        <option>Category</option>
        <option>Science</option>
        <option>Math</option>
        <option>Commerce</option>
      </select>
      <select className="px-2 py-1 rounded-md text-black">
        <option>City</option>
        <option>Delhi</option>
        <option>Bhopal</option>
        <option>Mumbai</option>
      </select>
      <select className="px-2 py-1 rounded-md text-black">
        <option>Rating</option>
        <option>5⭐</option>
        <option>4⭐ & above</option>
        <option>3⭐ & above</option>
      </select>
      <button className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 text-sm">Search</button>
    </div>

    {/* Right: Nav Links, Profile & Toggle */}
    <div className="flex items-center space-x-4 ml-6">
      <Link to="/" className="hover:text-gray-300 text-sm">Home</Link>
      <Link to="/about" className="hover:text-gray-300 text-sm">About Us</Link>
      <Link to="/contact" className="hover:text-gray-300 text-sm">Contact Us</Link>

      {!user ? (
        <Link to="/login" className="hover:text-gray-300 text-sm">Login</Link>
      ) : (
        <div className="relative" ref={dropdownRef}>
              <div className="flex items-center cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 text-sm">{user.displayName || 'User'}</span>
              </div>
          
              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50 overflow-hidden ${
                    darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-black border border-gray-200'
                  }`}
                >
                  <div className="px-4 py-3 border-b text-sm font-medium break-words">
                    {user.email || 'No email'}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="logout-btn flex items-center justify-center w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm">
                    <i className="bi bi-box-arrow-right mr-2"></i> Logout {/* Logout icon */}
                  </button>

  </div>
)}


        </div>
      )}

      {/* Move dark mode toggle to the end */}
      <button 
        className="dark-mode-toggle ml-4" 
        onClick={toggleDarkMode} 
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
