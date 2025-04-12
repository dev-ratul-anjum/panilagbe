import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import BackgroundImage from '../components/BackgroundImage';
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

        <BackgroundImage
          src="images/login-bg.jpg"
          placeholder="data:image/jpeg;base64,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"
          className={styles.loginImage}
        >

        </BackgroundImage>
        
      </div>
    </div>
  );
};

export default Login; 