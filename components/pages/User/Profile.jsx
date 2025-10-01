import React, { useEffect, useState } from 'react';
import '../../../styles/profilepage.css';
import useAuthStore from '../../stores/useAuthStore';
import { toast } from 'react-toastify';
import ChangePassword from './ChangePassword';
import useOrderStore from '../../stores/useOrderStore';

const Profile = () => {
  const { profile, user, updateProfile } = useAuthStore();
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const { fetchLastOrder, lastOrder, loading } = useOrderStore();
  const [carouselIndex, setCarouselIndex] = useState(0);

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
  }, []);

  // Fetch last order
  useEffect(() => {
    fetchLastOrder();
  }, []);

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
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  // Carousel navigation
  const handlePrev = () => {
    if (!lastOrder || !lastOrder.items) return;
    setCarouselIndex((prev) =>
      prev === 0 ? lastOrder.items.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!lastOrder || !lastOrder.items) return;
    setCarouselIndex((prev) =>
      prev === lastOrder.items.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main id='profile-page'>
      {showModal && <ChangePassword onClose={() => setShowModal(false)} />}
      <header id='welcome'>
        <h1>
          <span style={{ fontWeight: '200' }}>Hello,</span> {formData.name || user?.name}
        </h1>
        <p>Good Morning</p>
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
          </div>
        </div>

        {/* Last Order */}
        <div id="last-order">
          <h1 id='last-order-title'>Last Order</h1>

          {loading && <p>Loading...</p>}
          {!loading && !lastOrder && <div className='no-order-card'> <p>No orders yet.</p> </div> }

          {lastOrder && lastOrder.items.length > 0 && (
            <div className="order-card">
              <div className="order-summary">
                <p>
                    <span className={`status ${lastOrder.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {lastOrder.status}
                    </span>
                  </p>
                <p>Total: {lastOrder.totalPrice.toLocaleString()} IQD</p>
              </div>

              <div className="order-carousel">
                <button className="arrow left" onClick={handlePrev}>
                  &#10094;
                </button>

                <div className="order-items">
                  <div className="order-item-card">
                    <img
                      src={lastOrder.items[carouselIndex].image}
                      alt={lastOrder.items[carouselIndex].name}
                    />

                    <div className='order-item-info'>
                    <p>{lastOrder.items[carouselIndex].name}</p>
                    <p>Price: {lastOrder.items[carouselIndex].price.toLocaleString()} IQD</p>
                    <p>Quantity: {lastOrder.items[carouselIndex].quantity}</p>
                    </div>
                   
                  </div>
                </div>

                <button className="arrow right" onClick={handleNext}>
                  &#10095;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;
