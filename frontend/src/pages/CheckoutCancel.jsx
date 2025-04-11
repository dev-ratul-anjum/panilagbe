import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styles from './CheckoutResult.module.css';
import { useEffect, useState, useRef } from 'react';
import { checkCheckoutAuthorized } from '../utils/fetchApi';

const CheckoutCancel = ({ language, user }) => {
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const { tranId } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
      if(hasRun.current) return;
      hasRun.current = true;

      const handleCheckoutAuthorized = async () => {

        setLoading(true);
        const result = await  checkCheckoutAuthorized('cancel', tranId);

        if(result.data?.success){
          setVerified(true);
          setLoading(false);
        }else if(result.data?.success === false){
          setVerified(false);
          setLoading(false);
        }else{
          setLoading(false);
        }
    }
    handleCheckoutAuthorized();
  }, []);

  // Multilingual text
  const text = {
    en: {
      title: 'Payment Canceled',
      subtitle: 'Your transaction was canceled.',
      message: 'You have canceled the payment process. No charges have been made to your account.',
      returnToService: 'Return to Services',
      help: 'Need Help?',
      helpText: 'If you have any questions about your order or payment, please contact our customer support.'
    },
    bn: {
      title: 'পেমেন্ট বাতিল করা হয়েছে',
      subtitle: 'আপনার লেনদেন বাতিল করা হয়েছে।',
      message: 'আপনি পেমেন্ট প্রক্রিয়া বাতিল করেছেন। আপনার অ্যাকাউন্ট থেকে কোনও চার্জ করা হয়নি।',
      returnToService: 'সেবা পৃষ্ঠায় ফিরে যান',
      help: 'সাহায্য প্রয়োজন?',
      helpText: 'আপনার অর্ডার বা পেমেন্ট সম্পর্কে কোন প্রশ্ন থাকলে, দয়া করে আমাদের কাস্টমার সাপোর্টের সাথে যোগাযোগ করুন।'
    }
  };

  return (
    <div className={styles.checkoutResult} lang={language}>
      <div className={styles.container}>
        {loading ? (<div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>) : verified ? <><div className={styles.resultHeader}>
          <div className={styles.cancelIcon}>
            <svg className={styles.cancelMark} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <circle className={styles.cancelCircle} cx="26" cy="26" r="25" fill="none" />
              <path className={styles.cancelSlash} fill="none" d="M12 40L40 12" />
            </svg>
          </div>
          <h1 className={styles.resultTitle}>{text[language].title}</h1>
          <p className={styles.resultSubtitle}>{text[language].subtitle}</p>
        </div>

        <div className={styles.messageCard}>
          <p className={styles.messageText}>{text[language].message}</p>
        </div>

        <div className={styles.helpSection}>
          <h3>{text[language].help}</h3>
          <p>{text[language].helpText}</p>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={() => navigate('/service')} 
            className={`${styles.actionButton} ${styles.primaryButton}`}
          >
            {text[language].returnToService}
          </button>
          <button 
            onClick={() => navigate('/contact')} 
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            {text[language].help}
          </button>
        </div> </> : <Navigate to="/checkout-timeout" />}
        
      </div>
    </div>
  );
};

export default CheckoutCancel; 