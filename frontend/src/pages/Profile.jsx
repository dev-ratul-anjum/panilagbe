import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Profile.module.css';
import useAuth from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = ({ language }) => {
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Multilingual text
  const text = {
    en: {
      title: 'My Profile',
      userInfo: 'User Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
      changePassword: 'Change Password',
      orderHistory: 'Order History',
      noOrders: 'You have no orders yet.',
      orderPlaced: 'Order Placed',
      orderID: 'Order ID',
      waterType: 'Water Type',
      quantity: 'Quantity',
      amount: 'Amount',
      status: 'Status',
      viewDetails: 'View Details',
      logout: 'Logout',
      updateSuccess: 'Profile updated successfully!',
      updateError: 'Failed to update profile. Please try again.',
      loading: 'Loading...'
    },
    bn: {
      title: 'আমার প্রোফাইল',
      userInfo: 'ব্যবহারকারীর তথ্য',
      name: 'নাম',
      email: 'ইমেইল',
      phone: 'ফোন',
      address: 'ঠিকানা',
      edit: 'প্রোফাইল সম্পাদনা করুন',
      save: 'পরিবর্তনগুলি সংরক্ষণ করুন',
      cancel: 'বাতিল করুন',
      changePassword: 'পাসওয়ার্ড পরিবর্তন করুন',
      orderHistory: 'অর্ডার ইতিহাস',
      noOrders: 'আপনার এখনো কোন অর্ডার নেই।',
      orderPlaced: 'অর্ডার করা হয়েছে',
      orderID: 'অর্ডার আইডি',
      waterType: 'পানির ধরন',
      quantity: 'পরিমাণ',
      amount: 'পরিমাণ',
      status: 'অবস্থা',
      viewDetails: 'বিস্তারিত দেখুন',
      logout: 'লগআউট',
      updateSuccess: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      updateError: 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      loading: 'লোড হচ্ছে...'
    }
  };
  
  useEffect(() => {
    // Set user data for editing
    setUserData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    
  }, [ navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Cancel editing - reset to original values
      setUserData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
      });
    }
    setEditMode(!editMode);
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('panilagbe-token');
      if (!token) {
        throw new Error('No auth token');
      }
      
      const response = await axios.put(`${BACKEND_URL}/api/users/profile`, userData, {
        headers: {
          Authorization: `${token}`
        }
      });

      // Update user in global state
      setUser(response.data);
      
      // Exit edit mode
      setEditMode(false);
      
      // Show success message
      toast.success(text[language].updateSuccess, {className: styles.toastSuccess});
    } catch (err) {
      toast.error(text[language].updateError, {className: styles.toastError});
    }
  };
  
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('panilagbe-token');
    
    // Reset user state
    setUser(null);
    
    // Redirect to home page
    navigate('/');
  };
  
  return (
      <> <div className={styles.profile}>
      <div className={styles.container}>
        <h1>{text[language].title}</h1>
        
        <div className={styles.userSection}>
          <div className={styles.sectionHeader}>
            <h2>{text[language].userInfo}</h2>
            <button 
              onClick={handleEditToggle} 
              className={editMode ? styles.cancelButton : styles.editButton}
            >
              {editMode ? text[language].cancel : text[language].edit}
            </button>
          </div>
          
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">{text[language].name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">{text[language].email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                  disabled // Email shouldn't be editable
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">{text[language].phone}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="address">{text[language].address}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className={styles.saveButton}>
                {text[language].save}
              </button>
            </form>
          ) : (
            <div className={styles.userInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>{text[language].name}:</span>
                <span className={styles.value}>{user?.name}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>{text[language].email}:</span>
                <span className={styles.value}>{user?.email}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>{text[language].phone}:</span>
                <span className={styles.value}>{user?.phone}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>{text[language].address}:</span>
                <span className={styles.value}>{user?.address}</span>
              </div>
            </div>
          )}
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            {text[language].logout}
          </button>
        </div>
        
      </div>
    </div> 
    <ToastContainer />
    </> 
  );
};

export default Profile; 