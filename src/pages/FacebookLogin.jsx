// src/components/FacebookLogin.js
import React, { useState } from 'react';
import { auth, facebookProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const FacebookLogin = () => {
  const [message, setMessage] = useState('');

  const handleFacebookLogin = () => {
    // First, logout from Facebook (this clears any session and cookies)
    window.FB.logout((response) => {
      console.log('Logged out from Facebook');
      
      // Now trigger Facebook login
      window.FB.login(async (response) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;

          // Use the access token to authenticate with Firebase
          const credential = facebookProvider.credential(accessToken);
          
          try {
            await signInWithPopup(auth, facebookProvider);  // Login via Firebase
            window.location.href = '/';  // Redirect after successful login
          } catch (error) {
            console.error(error);
            setMessage('Facebook login failed.');
          }
        } else {
          setMessage('Facebook login was cancelled.');
        }
      }, {
        scope: 'email',       // Requesting email permission
        auth_type: 'reauthenticate',  // Forces prompt for credentials
      });
    });
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <button
        onClick={handleFacebookLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default FacebookLogin;
