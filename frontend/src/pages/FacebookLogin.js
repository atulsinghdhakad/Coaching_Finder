import React, { useEffect } from 'react';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path to your Firebase configuration file

const FacebookLogin = () => {
  useEffect(() => {
    // Load Facebook SDK
    const loadFBSDK = () => {
      if (window.FB) return;

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '3893553884230560', // 🔁 Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: 'v18.0',
        });
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadFBSDK();
  }, []);

  // const handleFacebookLogin = () => {
  //   if (!window.FB) return;

  //   window.FB.login(
  //     (response) => {
  //       if (response.authResponse) {
  //         console.log('✅ Logged in:', response);
  //         fetchFacebookUserData();
  //       } else {
  //         console.log('❌ User cancelled login or did not authorize.');
  //       }
  //     },
  //     { scope: 'public_profile,email' }
  //   );
  // };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // Additional logic for the user
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };
  

  const fetchFacebookUserData = () => {
    window.FB.api('/me', { fields: 'id,name,first_name,email' }, function (response) {
      console.log('📄 Facebook User Data:', response);
      alert(`Welcome, ${response.name}!`);
    });
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleFacebookLogin}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z"
          />
        </svg>
        Continue with Facebook
      </button>
    </div>
  );
};

export default FacebookLogin;
