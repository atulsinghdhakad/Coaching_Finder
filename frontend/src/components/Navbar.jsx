import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import coachingFinderLogo from './images/logo-png (1).png';
import './Navbar.css';

const Navbar = ({ setDarkMode, darkMode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  if (loading) return null;

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''} shadow-md`}>
      <div className="flex justify-between items-center w-full px-4 py-2 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="navbar-logo flex items-center space-x-2">
          <img src={coachingFinderLogo} alt="Logo" className="logo-img w-10 h-10" />
          <span className="logo-text text-xl font-semibold">Coaching Finder</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex space-x-2 items-center w-2/5 ml-10">
          <input
            type="text"
            placeholder="Search Institutes"
            className="px-3 py-1 rounded-md w-full text-black"
          />
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
          <button className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 text-sm text-white">
            Search
          </button>
        </div>

        {/* Desktop Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>

          {!user ? (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-blue-400"
                />
                <span className="ml-2 text-sm">{user.displayName || 'User'}</span>
              </div>

              {/* Animate Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50 overflow-hidden
                      ${darkMode ? 'bg-gray-800/80 text-white border border-gray-700' : 'bg-white/80 text-black border border-gray-200'}
                      backdrop-blur-md`}
                  >
                    <div className="px-4 py-3 border-b text-sm font-medium break-words">
                      {user.email || 'No email'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
                    >
                      <i className="bi bi-box-arrow-right mr-2"></i> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="text-xl ml-4">
            {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
          </button>
        </div>
      </div>

      {/* Animate Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-800 text-black dark:text-white py-4 space-y-4 px-6 overflow-hidden"
          >
            {/* Mobile Search */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search Institutes"
                className="px-3 py-2 rounded-md w-full text-black"
              />
              <select className="px-2 py-2 rounded-md w-full text-black">
                <option>Category</option>
                <option>Science</option>
                <option>Math</option>
                <option>Commerce</option>
              </select>
              <select className="px-2 py-2 rounded-md w-full text-black">
                <option>City</option>
                <option>Delhi</option>
                <option>Bhopal</option>
                <option>Mumbai</option>
              </select>
              <select className="px-2 py-2 rounded-md w-full text-black">
                <option>Rating</option>
                <option>5⭐</option>
                <option>4⭐ & above</option>
                <option>3⭐ & above</option>
              </select>
              <button className="bg-blue-600 w-full py-2 rounded-md hover:bg-blue-700 text-white">
                Search
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-4">
              <Link to="/" className="nav-link">
                Home
              </Link>

              <Link to="/about" className="nav-link">
                About
              </Link>

              <Link to="/contact" className="nav-link">
                Contact
              </Link>

              {!user ? (
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src={user.photoURL || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-blue-400"
                    />
                    <span className="ml-2 text-sm">{user.displayName || 'User'}</span>
                  </div>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50 overflow-hidden
                          ${darkMode ? 'bg-gray-800/80 text-white border border-gray-700' : 'bg-white/80 text-black border border-gray-200'}
                          backdrop-blur-md`}
                      >
                        <div className="px-4 py-3 border-b text-sm font-medium break-words">
                          {user.email || 'No email'}
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
                        >
                          <i className="bi bi-box-arrow-right mr-2"></i> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;