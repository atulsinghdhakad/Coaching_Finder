import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [showAccountLinking, setShowAccountLinking] = useState(false);
  const [linkingEmail, setLinkingEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    try {
      navigate(from, { replace: true });
      // navigate('/');
      navigate(from, { replace: true }); // ✅ go back to intended page
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      console.log('🔍 Attempting Google login...');
      await signInWithPopup(auth, googleProvider);
      console.log('✅ Google login successful');
      navigate('/');
    } catch (error) {
      console.error('❌ Google login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
        setMessage('Login cancelled. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setMessage('Login failed: Domain not authorized. Please contact support.');
      } else if (error.code === 'auth/popup-blocked') {
        setMessage('Popup blocked. Please allow popups for this site.');
      } else {
        setMessage(`Google login failed: ${error.message}`);
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent.');
    } catch (error) {
      setMessage('Reset email failed.');
    }
  };

  const handlePhoneLogin = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA verified'),
      }, auth);

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
    } catch (error) {
      setMessage(`Failed to send OTP: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await window.confirmationResult.confirm(otp);
      navigate('/');
    } catch (error) {
      setMessage(`OTP verification failed: ${error.message}`);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      console.log('🔍 Attempting Facebook login...');
      
      // First, try to sign in with Facebook
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('✅ Facebook login successful');
      navigate('/');
      
    } catch (error) {
      console.error('❌ Facebook login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        // This is the key error we need to handle
        const email = error.customData?.email;
        
        if (email) {
          try {
            // Check what sign-in methods are available for this email
            const methods = await fetchSignInMethodsForEmail(auth, email);
            
            if (methods.includes('google.com')) {
              setMessage('⚠️ An account with this email already exists using Google. Please sign in with Google first, then you can link your Facebook account.');
            } else if (methods.includes('password')) {
              setMessage('⚠️ An account with this email already exists using email/password. Please sign in with your password first, then you can link your Facebook account.');
            } else {
              setMessage('⚠️ An account with this email already exists using a different method. Please try the original sign-in method.');
            }
          } catch (fetchError) {
            setMessage('⚠️ Account linking issue detected. Please try signing in with Google or email/password instead.');
          }
        } else {
          setMessage('⚠️ Account linking issue. Please try signing in with Google or email/password instead.');
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        setMessage('Login cancelled. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setMessage('Login failed: Domain not authorized. Please contact support.');
      } else if (error.code === 'auth/popup-blocked') {
        setMessage('Popup blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setMessage('Facebook login is not enabled. Please contact support.');
      } else if (error.code === 'auth/invalid-credential') {
        setMessage('Invalid Facebook credentials. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setMessage('Network error. Please check your internet connection and try again.');
      } else {
        setMessage(`Facebook login failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>
        {message && (
          <div className={`p-3 rounded-md mb-4 text-center ${
            message.includes('account-exists-with-different-credential') || message.includes('⚠️')
              ? 'bg-yellow-100 border border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 border border-red-400 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            <p className="text-sm">{message}</p>
            {message.includes('account-exists-with-different-credential') && (
              <div className="mt-2">
                <p className="text-xs opacity-75 mb-2">
                  💡 To link your Facebook account:
                </p>
                <div className="text-xs space-y-1">
                  <p>1. Sign in with your original method (Google/Email)</p>
                  <p>2. Go to your profile settings</p>
                  <p>3. Link your Facebook account there</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!isOtpSent && !isPhoneLogin ? (
          <>
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
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-3"
            >
              Login
            </button>

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
              <button onClick={handleForgotPassword} className="hover:underline">Forgot password?</button>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-300 mb-3">OR</div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full bg-white dark:bg-gray-700 border p-3 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition mb-3"
            >
              <FcGoogle className="text-2xl mr-2" />
              Continue with Google
            </button>

            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-3"
            >
              <FaFacebook className="text-2xl mr-2" />
              Continue with Facebook
            </button>

            <button
              onClick={() => setIsPhoneLogin(true)}
              className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
            >
              Login with Phone
            </button>
          </>
        ) : isPhoneLogin && !isOtpSent ? (
          <>
            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="+91XXXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              onClick={handlePhoneLogin}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition mb-4"
            >
              Send OTP
            </button>
            <button
              onClick={() => setIsPhoneLogin(false)}
              className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition"
            >
              Back to Email Login
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default LoginPage;
