import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        email: currentUser.email,
        phone: currentUser.phoneNumber || "N/A",
      });
    }
  }, [currentUser]);

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {currentUser ? (
        <>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
