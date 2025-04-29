// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase'; // ✅ Firebase auth

const ADMIN_EMAILS = ['youradmin@gmail.com']; // ✅ List of admin emails here

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth status
  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    // User is not logged in ➔ redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !ADMIN_EMAILS.includes(user.email)) {
    // User is logged in but not an admin ➔ redirect to Home
    return <Navigate to="/" replace />;
  }

  // If the user is valid and has correct permissions, render children
  return children;
};

export default PrivateRoute;