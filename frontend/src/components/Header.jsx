import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import logo from '../assets/panilagbelogo.png';
import useAuth from '../hooks/useAuth';

const Header = ({ language, onLanguageChange,  onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {user} = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector(`.${styles.nav}`);
      const toggle = document.querySelector(`.${styles.mobileMenuToggle}`);
      
      if (isMenuOpen && nav && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    
    // Close menu when changing route
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };
    
    // Prevent body scrolling when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
      document.body.style.overflow = 'visible';
    };
  }, [isMenuOpen]);

  // Multilingual text
  const text = {
    en: {
      home: 'Home',
      about: 'About',
      service: 'Service',
      contact: 'Contact',
      payment: 'Payment',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      logout: 'Logout'
    },
    bn: {
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      service: 'সেবা',
      contact: 'যোগাযোগ',
      payment: 'পেমেন্ট',
      login: 'লগইন',
      register: 'রেজিস্টার',
      profile: 'প্রোফাইল',
      logout: 'লগআউট'
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={()=> window.location.replace('/')}>
          <img src={logo} alt="Pani Lagbe" />
        </Link>

        <div 
          className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                {text[language].home}
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                {text[language].about}
              </Link>
            </li>
            <li>
              <Link to="/service" onClick={() => setIsMenuOpen(false)}>
                {text[language].service}
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                {text[language].contact}
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/payment" onClick={() => setIsMenuOpen(false)}>
                  {text[language].payment}
                </Link>
              </li>
            )}
          </ul>

          <div className={styles.language}>
            <button 
              className={language === 'en' ? styles.active : ''}
              onClick={() => onLanguageChange('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button 
              className={language === 'bn' ? styles.active : ''}
              onClick={() => onLanguageChange('bn')}
              aria-label="Switch to Bengali"
            >
              বাং
            </button>
          </div>

          <div className={styles.auth}>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={styles.authLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {text[language].profile}
                </Link>
                <button 
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }} 
                  className={styles.authButton + ' ' + styles.logoutButton}
                >
                  {text[language].logout}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={styles.authLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {text[language].login}
                </Link>
                <Link 
                  to="/register" 
                  className={styles.authButton}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {text[language].register}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 