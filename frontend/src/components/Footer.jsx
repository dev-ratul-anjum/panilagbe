import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../assets/panilagbe-logo.svg';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = ({ language }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Multilingual text
  const text = {
    en: {
      quickLinks: 'Quick Links',
      home: 'Home',
      about: 'About',
      service: 'Service',
      contact: 'Contact',
      newsletter: 'Newsletter',
      subscribeText: 'Subscribe to receive updates on our latest products and special offers.',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      thanks: 'Thanks for subscribing!',
      contactUs: 'Contact Us',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      footerText: 'Pani Lagbe - Your reliable water delivery service in Bangladesh',
      copyright: '© 2025 Pani Lagbe. All rights reserved.',
      weAccept: 'We Accept:'
    },
    bn: {
      quickLinks: 'দ্রুত লিঙ্ক',
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      service: 'সেবা',
      contact: 'যোগাযোগ',
      newsletter: 'নিউজলেটার',
      subscribeText: 'আমাদের সর্বশেষ পণ্য এবং বিশেষ অফার সম্পর্কে আপডেট পেতে সাবস্ক্রাইব করুন।',
      emailPlaceholder: 'আপনার ইমেইল লিখুন',
      subscribe: 'সাবস্ক্রাইব',
      thanks: 'সাবস্ক্রাইব করার জন্য ধন্যবাদ!',
      contactUs: 'যোগাযোগ করুন',
      phone: 'ফোন',
      email: 'ইমেইল',
      address: 'ঠিকানা',
      footerText: 'পানি লাগবে - বাংলাদেশের নির্ভরযোগ্য পানি ডেলিভারি সেবা',
      copyright: '© ২০২৫ পানি লাগবে। সমস্ত অধিকার সংরক্ষিত।',
      weAccept: 'আমরা গ্রহণ করি:'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically make an API call to subscribe the email
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      
      // Reset the subscribed state after a few seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <img src={logo} alt="Pani Lagbe" />
            <p>{text[language].footerText}</p>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/panilagbe" className={styles.socialIcon} aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://www.twitter.com/panilagbe" className={styles.socialIcon} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/panilagbe" className={styles.socialIcon} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/panilagbe" className={styles.socialIcon} aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div className={styles.footerLinks}>
            <h3>{text[language].quickLinks}</h3>
            <ul>
              <li><Link to="/">{text[language].home}</Link></li>
              <li><Link to="/about">{text[language].about}</Link></li>
              <li><Link to="/service">{text[language].service}</Link></li>
              <li><Link to="/contact">{text[language].contact}</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerContact}>
            <h3>{text[language].contactUs}</h3>
            <ul>
              <li>
                <FaPhone className={styles.contactIcon} />
                <div>
                  <strong>{text[language].phone}:</strong>
                  <span>+880 1712-345678</span>
                </div>
              </li>
              <li>
                <FaEnvelope className={styles.contactIcon} />
                <div>
                  <strong>{text[language].email}:</strong>
                  <span>info@panilagbe.com</span>
                </div>
              </li>
              <li>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <div>
                  <strong>{text[language].address}:</strong>
                  <span>123 Water Street, Dhaka, Bangladesh</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerNewsletter}>
            <h3>{text[language].newsletter}</h3>
            <p>{text[language].subscribeText}</p>
            
            {subscribed ? (
              <p className={styles.thanksMessage}>{text[language].thanks}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={text[language].emailPlaceholder}
                  required
                />
                <button type="submit">{text[language].subscribe}</button>
              </form>
            )}
            
            <div className={styles.acceptedPayments}>
              <p>{text[language].weAccept}</p>
              <div className={styles.paymentIcons}>
                <img 
                  src="/images/bkash.png" 
                  alt="bKash" 
                  className={styles.paymentIcon} 
                />
                <img 
                  src="/images/nagad.png" 
                  alt="Nagad" 
                  className={styles.paymentIcon} 
                />
                <img 
                  src="/images/mastercard.png" 
                  alt="MasterCard" 
                  className={styles.paymentIcon} 
                />
                <img 
                  src="/images/visa.png" 
                  alt="Visa" 
                  className={styles.paymentIcon} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>{text[language].copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 