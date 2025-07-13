import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { updateProfile, updatePassword, signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import ImageCropper from '../components/ImageCropper';
import { useAuth } from '../context/AuthContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

Modal.setAppElement('#root');

const ADMIN_EMAILS = ['atulsinghdhakad15@gmail.com'];

const ProfilePage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [croppedPhoto, setCroppedPhoto] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setNewDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      if (newDisplayName && newDisplayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
      }
      if (croppedPhoto) {
        // This part needs a proper implementation to upload the blob to a storage service (like Firebase Storage)
        // and get a URL back. For now, we'll use the local blob URL which is temporary.
        const photoURL = URL.createObjectURL(croppedPhoto);
        await updateProfile(auth.currentUser, { photoURL });
      }
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Password updated successfully!');
      }
      toast.success('Profile updated successfully!');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`Error updating profile: ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success('Signed out successfully!');
    navigate('/login');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProfilePhoto(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (blob) => {
    setCroppedPhoto(blob);
    setShowCropper(false);
    toast.success('Photo cropped and ready to be saved.');
  };

  // Phone Number Verification (2FA)
  const handlePhoneNumberVerification = () => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    }, auth);
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success('OTP sent to your phone!');
      })
      .catch((error) => {
        toast.error('Error sending OTP: ' + error.message);
      });
  };

  // Verify OTP and complete phone authentication
  const verifyOTP = () => {
    const { confirmationResult } = window;
    confirmationResult.confirm(verificationCode)
      .then((result) => {
        setIsPhoneVerified(true);
        toast.success('Phone verified successfully!');
      })
      .catch((error) => {
        toast.error('Error verifying OTP: ' + error.message);
      });
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen text-lg text-purple-500">Loading Profile...</div>;
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  const userType = isAdmin ? 'Administrator' : 'User';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="md:grid md:grid-cols-3">
          {/* Left Column: Profile Info */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-800 p-8 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={croppedPhoto ? URL.createObjectURL(croppedPhoto) : user.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg"
              />
              <span 
                className={`absolute bottom-1 right-1 px-2 py-0.5 text-xs font-semibold rounded-full shadow-md ${isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'}`}
              >
                {userType}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white">{user.displayName || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <p><strong>Phone Verified:</strong> {isPhoneVerified ? 'Yes' : 'No'}</p>
            <p><strong>2FA Enabled:</strong> {is2FAEnabled ? 'Enabled' : 'Not Enabled'}</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold text-sm shadow-lg transition-transform transform hover:scale-105">
              Edit Profile
            </button>
          </div>

          {/* Right Column: Actions */}
          <div className="md:col-span-2 p-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Account Actions</h3>
            <div className="space-y-4">
              {isAdmin && (
                <Link to="/adminpanel" className="flex items-center gap-4 w-full bg-purple-50 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-5 rounded-lg font-semibold shadow transition-all">
                  <i className="bi bi-shield-lock text-xl text-purple-500"></i>
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link to="/settings" className="flex items-center gap-4 w-full bg-purple-50 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-5 rounded-lg font-semibold shadow transition-all">
                <i className="bi bi-gear text-xl text-purple-500"></i>
                <span>Settings</span>
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-4 w-full bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-5 rounded-lg font-semibold shadow transition-all">
                <i className="bi bi-box-arrow-right text-xl text-red-500"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="image-cropper-modal" overlayClassName="image-cropper-overlay">
          {!showCropper ? (
            <>
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                <label className="font-semibold">Display Name
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={e => setNewDisplayName(e.target.value)}
                    className="w-full p-2 rounded border mt-1 bg-gray-50 dark:bg-gray-700"
                    placeholder="New Display Name"
                  />
                </label>
                <label className="font-semibold">Change Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </label>
                 <label className="font-semibold">New Password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full p-2 rounded border mt-1 bg-gray-50 dark:bg-gray-700"
                    placeholder="Leave blank to keep current password"
                  />
                </label>
                <label className="font-semibold">Phone Number (For 2FA)
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 rounded border mt-1 bg-gray-50 dark:bg-gray-700"
                    placeholder="Enter phone number"
                  />
                  <button type="button" onClick={handlePhoneNumberVerification}>Send OTP</button>
                </label>
                <label className="font-semibold">Verification Code
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 rounded border mt-1 bg-gray-50 dark:bg-gray-700"
                    placeholder="Enter OTP"
                  />
                  <button type="button" onClick={verifyOTP}>Verify OTP</button>
                </label>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold">Save Changes</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-semibold">Cancel</button>
                </div>
              </form>
            </>
          ) : (
            <ImageCropper
              imageSrc={newProfilePhoto}
              onCrop={handleCrop}
              onClose={() => setShowCropper(false)}
            />
          )}
          <div id="recaptcha-container"></div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;