// src/pages/ProfilePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const ProfilePage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <img
          src={user?.photoURL || 'https://via.placeholder.com/100'}
          alt="User"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.displayName || 'User'}</h2>
        <p className="text-gray-700 dark:text-gray-300">{user?.email}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.phoneNumber || 'Phone not available'}</p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
