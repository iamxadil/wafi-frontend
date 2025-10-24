// src/components/profile/Profile.jsx
import React, { useEffect, useState } from 'react';
import '../../../styles/profilepage.css';
import useAuthStore from '../../stores/useAuthStore';
import { toast } from 'react-toastify';
import ChangePassword from './ChangePassword';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from "lucide-react";

const Profile = () => {
  const { profile, user, updateProfile, logout } = useAuthStore();
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Dynamic Greeting
  const [greeting, setGreeting] = useState("");
  const [Icon, setIcon] = useState(Sun);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
      setIcon(Sun);
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
      setIcon(Sun);
    } else {
      setGreeting("Good Evening");
      setIcon(Moon);
    }
  }, []);

  // Modal Opening
  const handleOpenModal = () => setShowModal(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  // Initialize user profile
  useEffect(() => {
    profile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        ...(formData.currentPassword && formData.newPassword
          ? { currentPassword: formData.currentPassword, newPassword: formData.newPassword }
          : {}),
      });

      toast.success('Profile Updated Successfully');
      setIsEdit(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => logout(navigate);

  // --- Conditional Rendering ---
  if (!user) {
    return (
      <main id='not-signed-in-page'>
        <motion.div
          className='not-signed-in-glass'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2>Welcome!</h2>
          <p>You need to sign in or register to view your profile.</p>
          <div className='auth-buttons'>
            <Link to='/signin' className='btn-login'>Sign In</Link>
            <Link to='/register' className='btn-register'>Register</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main id='profile-page'>
      {showModal && <ChangePassword onClose={() => setShowModal(false)} />}

      <header id='welcome'>
        <h1>
          <span style={{ fontWeight: '200' }}>Hello,</span> {formData.name || user?.name}
        </h1>
        <p>{greeting} <Icon size={18} /></p>
      </header>

      <section id='main-page'>
        {/* User Info */}
        <div id='user-info'>
          <div id='user-info-header'>
            <h1>Personal Info</h1>
            {isEdit ? (
              <button onClick={handleSave} className='save-info'>
                Save Profile
              </button>
            ) : (
              <button onClick={() => setIsEdit(true)}>Edit Profile</button>
            )}
          </div>

          <div id='edit-info'>
            <h2>
              Name{' '}
              <span>
                {isEdit ? (
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  formData.name || user.name
                )}
              </span>
            </h2>

            <h2>
              Email{' '}
              <span>
                {isEdit ? (
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  formData.email || user.email
                )}
              </span>
            </h2>

            <button className='change-password' onClick={handleOpenModal}>
              Change Password
            </button>

            <button className='logout-btn' onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>


      </section>
    </main>
  );
};

export default Profile;
