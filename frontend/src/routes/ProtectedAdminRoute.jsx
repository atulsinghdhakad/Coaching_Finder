// src/routes/ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ADMIN_EMAIL = "atulsinghdhakad15@gmail.com"; // 🔥 Replace with your admin email

const ProtectedAdminRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [checkingAuth, setCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div className="fixed top-4 right-4 flex flex-col items-center space-y-2 z-50">
        <div className="h-8 w-8 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 dark:text-gray-300">Checking access...</p>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-center p-10">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Access Denied</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Sorry, you do not have permission to access this page.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;