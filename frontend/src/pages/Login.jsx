import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = ({ language }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Multilingual text
  const text = {
    en: {
      title: 'Login to Your Account',
      subtitle: 'Welcome back! Please enter your details.',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      loginButton: 'Login',
      registerPrompt: 'Don\'t have an account?',
      registerLink: 'Register here',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email',
      passwordRequired: 'Password is required',
      passwordLength: 'Password must be at least 6 characters',
      loginFailed: 'Login failed. Please check your credentials.'
    },
    bn: {
      title: 'আপনার অ্যাকাউন্টে লগইন করুন',
      subtitle: 'আবারও স্বাগতম! আপনার বিবরণ লিখুন।',
      emailLabel: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'আপনার ইমেইল লিখুন',
      passwordLabel: 'পাসওয়ার্ড',
      passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
      loginButton: 'লগইন',
      registerPrompt: 'অ্যাকাউন্ট নেই?',
      registerLink: 'এখানে নিবন্ধন করুন',
      emailRequired: 'ইমেইল প্রয়োজন',
      emailInvalid: 'একটি বৈধ ইমেইল লিখুন',
      passwordRequired: 'পাসওয়ার্ড প্রয়োজন',
      passwordLength: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
      loginFailed: 'লগইন ব্যর্থ হয়েছে। আপনার তথ্য যাচাই করুন।'
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = text[language].emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = text[language].emailInvalid;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = text[language].passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = text[language].passwordLength;
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
    
    // Clear login error when user changes input
    if (loginError) {
      setLoginError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/login`, formData);
      
      // Store token in localStorage
      localStorage.setItem('panilagbe-token', response.data.token);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      setLoginError(text[language].loginFailed);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={styles.loginForm}>
          <h1>{text[language].title}</h1>
          <p className={styles.subtitle}>{text[language].subtitle}</p>
          
          {loginError && (
            <div className={styles.errorMessage}>{loginError}</div>
          )}
          
          <form onSubmit={handleSubmit}>
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
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? '...' : text[language].loginButton}
            </button>
          </form>
          
          <div className={styles.registerLink}>
            <span>{text[language].registerPrompt}</span>
            <Link to="/register">{text[language].registerLink}</Link>
          </div>
        </div>
        
        <div className={styles.loginImage}>
          {/* This would typically be an image */}
        </div>
      </div>
    </div>
  );
};

export default Login; 