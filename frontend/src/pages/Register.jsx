import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Register = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  // Multilingual text
  const text = {
    en: {
      title: 'Create an Account',
      subtitle: 'Sign up for quick water delivery services',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      emailError: 'Email already exists',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      addressLabel: 'Delivery Address',
      addressPlaceholder: 'Enter your delivery address',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      registerButton: 'Register',
      loginPrompt: 'Already have an account?',
      loginLink: 'Login here',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Please enter a valid phone number',
      addressRequired: 'Address is required',
      passwordRequired: 'Password is required',
      passwordLength: 'Password must be at least 6 characters',
      passwordsNotMatch: 'Passwords do not match',
      registrationFailed: 'Registration failed. Please try again.'
    },
    bn: {
      title: 'একটি অ্যাকাউন্ট তৈরি করুন',
      subtitle: 'দ্রুত পানি সরবরাহ পরিষেবার জন্য সাইন আপ করুন',
      nameLabel: 'পুরো নাম',
      namePlaceholder: 'আপনার পুরো নাম লিখুন',
      emailLabel: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'আপনার ইমেইল লিখুন',
      emailError: 'এই ইমেইলের জন্য অ্যাকাউন্ট আছে',
      phoneLabel: 'ফোন নম্বর',
      phonePlaceholder: 'আপনার ফোন নম্বর লিখুন',
      addressLabel: 'ডেলিভারি ঠিকানা',
      addressPlaceholder: 'আপনার ডেলিভারি ঠিকানা লিখুন',
      passwordLabel: 'পাসওয়ার্ড',
      passwordPlaceholder: 'একটি পাসওয়ার্ড তৈরি করুন',
      confirmPasswordLabel: 'পাসওয়ার্ড নিশ্চিত করুন',
      confirmPasswordPlaceholder: 'আপনার পাসওয়ার্ড নিশ্চিত করুন',
      registerButton: 'নিবন্ধন করুন',
      loginPrompt: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
      loginLink: 'এখানে লগইন করুন',
      nameRequired: 'নাম প্রয়োজন',
      emailRequired: 'ইমেইল প্রয়োজন',
      emailInvalid: 'একটি বৈধ ইমেইল লিখুন',
      phoneRequired: 'ফোন নম্বর প্রয়োজন',
      phoneInvalid: 'একটি বৈধ ফোন নম্বর লিখুন',
      addressRequired: 'ঠিকানা প্রয়োজন',
      passwordRequired: 'পাসওয়ার্ড প্রয়োজন',
      passwordLength: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
      passwordsNotMatch: 'পাসওয়ার্ড মেলে না',
      registrationFailed: 'নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = text[language].nameRequired;
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = text[language].emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = text[language].emailInvalid;
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = text[language].phoneRequired;
    } else if (!/^[0-9+\- ]{10,15}$/.test(formData.phone)) {
      newErrors.phone = text[language].phoneInvalid;
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = text[language].addressRequired;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = text[language].passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = text[language].passwordLength;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = text[language].passwordsNotMatch;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear registration error when user changes input
    if (registerError) {
      setRegisterError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setRegisterError('');
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await axios.post(`${BACKEND_URL}/api/users/register`, registrationData);

      // Store token in localStorage
      localStorage.setItem('panilagbe-token', response.data.token);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      if( error.response?.data?.errors?.email){
        setErrors({
          ...errors,
          email: text[language].emailError
        });
        return;
      }
      setRegisterError(text[language].registrationFailed);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.register}>
      <div className={styles.container}>
        <div className={styles.registerForm}>
          <h1>{text[language].title}</h1>
          <p className={styles.subtitle}>{text[language].subtitle}</p>
          
          {registerError && (
            <div className={styles.errorMessage}>{registerError}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{text[language].nameLabel}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={text[language].namePlaceholder}
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && <div className={styles.fieldError}>{errors.name}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">{text[language].emailLabel}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={text[language].emailPlaceholder}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">{text[language].phoneLabel}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={text[language].phonePlaceholder}
                className={errors.phone ? styles.inputError : ''}
              />
              {errors.phone && <div className={styles.fieldError}>{errors.phone}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address">{text[language].addressLabel}</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={text[language].addressPlaceholder}
                className={errors.address ? styles.inputError : ''}
              />
              {errors.address && <div className={styles.fieldError}>{errors.address}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">{text[language].passwordLabel}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={text[language].passwordPlaceholder}
                className={errors.password ? styles.inputError : ''}
              />
              {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">{text[language].confirmPasswordLabel}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={text[language].confirmPasswordPlaceholder}
                className={errors.confirmPassword ? styles.inputError : ''}
              />
              {errors.confirmPassword && <div className={styles.fieldError}>{errors.confirmPassword}</div>}
            </div>
            
            <button 
              type="submit" 
              className={styles.registerButton}
              disabled={isLoading}
            >
              {isLoading ? '...' : text[language].registerButton}
            </button>
          </form>
          
          <div className={styles.loginLink}>
            <span>{text[language].loginPrompt}</span>
            <Link to="/login">{text[language].loginLink}</Link>
          </div>
        </div>
        
        <div className={styles.registerImage}>
          {/* This would typically be an image  */}
        </div>
      </div>
    </div>
  );
};

export default Register; 