import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import styles from './CheckoutResult.module.css';
import { useEffect, useRef, useState } from 'react';
import { checkCheckoutAuthorized } from '../utils/fetchApi';

const CheckoutFail = ({ language, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tranId } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    const handleCheckoutAuthorized = async () => {
      setLoading(true);
      const result = await  checkCheckoutAuthorized('fail', tranId);
      
      if(result.data?.success){
        setVerified(true);
        setLoading(false);
      }else if(result.data?.success === false){
        setVerified(false);
        setLoading(false);
      }else{
        console.error('Error fetching order details:', result);
        setLoading(false);
      }
  }
  handleCheckoutAuthorized();
  }, []);
  
  // Get error info from URL if available
  const params = new URLSearchParams(location.search);
  const errorMessage = params.get('message') || null;
  
  // Multilingual text
  const text = {
    en: {
      title: 'Payment Failed',
      subtitle: 'Your transaction could not be processed.',
      errorTitle: 'What went wrong?',
      defaultError: 'There was an issue processing your payment. Please try again or choose a different payment method.',
      tryAgain: 'Try Again',
      returnToService: 'Return to Services',
      contactSupport: 'Contact Support',
      supportText: 'If you continue to face issues, please contact our support team for assistance.'
    },
    bn: {
      title: 'পেমেন্ট ব্যর্থ হয়েছে',
      subtitle: 'আপনার লেনদেন প্রক্রিয়া করা যায়নি।',
      errorTitle: 'কি সমস্যা হয়েছে?',
      defaultError: 'আপনার পেমেন্ট প্রক্রিয়া করতে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা অন্য পেমেন্ট পদ্ধতি বেছে নিন।',
      tryAgain: 'আবার চেষ্টা করুন',
      returnToService: 'সেবা পৃষ্ঠায় ফিরে যান',
      contactSupport: 'সাপোর্টের সাথে যোগাযোগ করুন',
      supportText: 'আপনি যদি সমস্যা অব্যাহত রাখেন, তবে সহায়তার জন্য দয়া করে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।'
    }
  };

  return (
    <div className={styles.checkoutResult} lang={language}>
      <div className={styles.container}>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        ) : verified ? <><div className={styles.resultHeader}>
          <div className={styles.failIcon}>
            <svg className={styles.xmark} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <circle className={styles.xmarkCircle} cx="26" cy="26" r="25" fill="none" />
              <path className={styles.xmarkPath} fill="none" d="M16 16 36 36 M36 16 16 36" />
            </svg>
          </div>
          <h1 className={styles.resultTitle}>{text[language].title}</h1>
          <p className={styles.resultSubtitle}>{text[language].subtitle}</p>
        </div>

        <div className={styles.errorCard}>
          <h2>{text[language].errorTitle}</h2>
          <p className={styles.errorMessage}>
            {errorMessage || text[language].defaultError}
          </p>
        </div>

        <div className={styles.supportInfo}>
          <p>{text[language].supportText}</p>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={() => navigate('/service')} 
            className={`${styles.actionButton} ${styles.primaryButton}`}
          >
            {text[language].tryAgain}
          </button>
          <button 
            onClick={() => navigate('/contact')} 
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            {text[language].contactSupport}
          </button>
        </div> </> : <Navigate to="/checkout-timeout" />}
        
      </div>
    </div>
  );
};

export default CheckoutFail; 