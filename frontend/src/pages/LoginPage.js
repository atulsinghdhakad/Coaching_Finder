import React, { useState, useEffect } from 'react';
import { auth, googleProvider, facebookProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Load Facebook SDK once
  useEffect(() => {
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) return;

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';

      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: '3893553884230560', // Replace with your Facebook App ID
            cookie: true,
            xfbml: true,
            version: 'v18.0',
          });
          console.log('Facebook SDK initialized');
        }
      };

      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Failed to sign in with Google.');
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      setMessage('Facebook SDK not loaded.');
      return;
    }

    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          try {
            await signInWithPopup(auth, facebookProvider);
            navigate('/');
          } catch (error) {
            console.error(error);
            setMessage('Failed to sign in with Facebook.');
          }
        } else {
          setMessage('Facebook login cancelled.');
        }
      },
      { scope: 'email' }
    );
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent to your email.');
    } catch (error) {
      setMessage('Failed to send reset email.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>

        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-4"
        >
          Login
        </button>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
          <button onClick={handleForgotPassword} className="hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-300 mb-2">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white dark:bg-gray-700 border p-3 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition mb-3"
        >
          <FcGoogle className="text-2xl mr-2" />
          Continue with Google
        </button>

        <button
          onClick={handleFacebookLogin}
          className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          <FaFacebook className="text-2xl mr-2" />
          Continue with Facebook
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
