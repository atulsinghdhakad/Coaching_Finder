import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';  // Make sure to import Firebase Auth

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the current user from Firebase
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect to login if no user is found
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        // Redirect to login after logout
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md">
        {user ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Profile</h2>

            <div className="flex justify-center mb-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex justify-center items-center text-white">
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </div>
              )}
            </div>

            <p className="text-center text-gray-800 dark:text-white text-lg mb-4">{user.displayName || 'No name available'}</p>
            <p className="text-center text-gray-600 dark:text-gray-300">{user.email || 'No email available'}</p>

            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-800 dark:text-white">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
