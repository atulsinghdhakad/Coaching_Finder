import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../../src/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      setMessage('Failed to sign up with Google.');
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate('/');
    } catch (error) {
      setMessage('Failed to sign up with Facebook.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign Up</h2>

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

        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-4"
        >
          Sign Up
        </button>

        <div className="text-center text-gray-500 dark:text-gray-300 mb-2">OR</div>

        <button
          onClick={handleGoogleSignUp}
          className="flex items-center justify-center w-full bg-white dark:bg-gray-700 border p-3 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition mb-3"
        >
          <FcGoogle className="text-2xl mr-2" />
          Continue with Google
        </button>

        <button
          onClick={handleFacebookSignUp}
          className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          <FaFacebook className="text-2xl mr-2" />
          Continue with Facebook
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
