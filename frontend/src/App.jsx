import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import './App.css'; // Ensure global styles
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './components/Footer'; // Import Footer component
import ScrollToTop from './pages/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import ScrollProgressBar from './pages/ScrollProgressBar';
import NotFoundPage from './pages/NotFoundPage'; // Import NotFoundPage component
import BottomToastNotification from './pages/BottomToastNotification';
import PrivacyPolicy from './pages/PrivacyPolicy'; // Import PrivacyPolicy component




const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check localStorage for dark mode preference on load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
    <Router>
      {/* Dark mode toggle applied globally to the root element */}
      <div className={darkMode ? 'dark' : ''}>
      <ScrollProgressBar />
      <ScrollToTop/>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        
        <Footer />
        <ScrollToTop />
        
      </div>
      
    </Router>
    <Toaster position="bottom-center" /> {/* Optional: Place toasts at bottom */}
      <BottomToastNotification />
    </>
    
  );
};

export default App;
