import { useState } from 'react';
import { auth } from './firebase';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOtp = async () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          { size: 'invisible' },
          auth // ✅ Correct binding here
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
    } catch (error) {
      console.error("OTP error:", error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await window.confirmationResult.confirm(otp);
      alert('Phone login success!');
    } catch (err) {
      console.error("OTP verification error:", err.message);
    }
  };

  return (
    <div>
      <h2>Phone Login</h2>
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" />
      <button onClick={sendOtp}>Send OTP</button>

      {isOtpSent && (
        <>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default PhoneLogin;
