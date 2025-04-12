import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';
import BackgroundImage from '../components/BackgroundImage';
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

        <BackgroundImage
          src="images/register-background.jpg"
          placeholder="data:image/jpeg;base64,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"
          className={styles.registerImage}
        >

        </BackgroundImage>
      </div>
    </div>
  );
};

export default Register; 