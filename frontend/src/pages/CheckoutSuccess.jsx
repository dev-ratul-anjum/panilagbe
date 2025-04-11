import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import styles from './CheckoutResult.module.css';
import { checkCheckoutAuthorized } from '../utils/fetchApi';

const CheckoutSuccess = ({ language, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tranId } = useParams();
  const [loading, setLoading] = useState(true);

  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const handleCheckoutAuthorized = async () => {
        setLoading(true);
        const result = await  checkCheckoutAuthorized('success', tranId);
        
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

  }, [location.search]);

  // Multilingual text
  const text = {
    en: {
      title: 'Payment Successful!',
      subtitle: 'Your transaction has been completed successfully.',
      orderNumber: 'Order Number',
      transactionId: 'Transaction ID',
      orderDate: 'Order Date',
      paymentMethod: 'Payment Method',
      amount: 'Amount',
      status: 'Status',
      paid: 'Paid',
      deliveryStatus: 'Delivery Status',
      processing: 'Processing',
      shippingInfo: 'Shipping Information',
      returnToProfile: 'View Your Orders',
      continueShopping: 'Continue Shopping',
      thankYou: 'Thank you for your order!',
      orderConfirmation: 'We\'ve sent a confirmation to your email address.',
      deliveryUpdate: 'You will receive delivery updates soon.'
    },
    bn: {
      title: 'পেমেন্ট সফল!',
      subtitle: 'আপনার লেনদেন সফলভাবে সম্পন্ন হয়েছে।',
      orderNumber: 'অর্ডার নম্বর',
      transactionId: 'লেনদেন আইডি',
      orderDate: 'অর্ডারের তারিখ',
      paymentMethod: 'পেমেন্ট পদ্ধতি',
      amount: 'পরিমাণ',
      status: 'অবস্থা',
      paid: 'পরিশোধিত',
      deliveryStatus: 'ডেলিভারি অবস্থা',
      processing: 'প্রক্রিয়াধীন',
      shippingInfo: 'শিপিং তথ্য',
      returnToProfile: 'আপনার অর্ডার দেখুন',
      continueShopping: 'শপিং চালিয়ে যান',
      thankYou: 'আপনার অর্ডারের জন্য ধন্যবাদ!',
      orderConfirmation: 'আমরা আপনার ইমেইল ঠিকানায় একটি নিশ্চিতকরণ পাঠিয়েছি।',
      deliveryUpdate: 'আপনি শীঘ্রই ডেলিভারি আপডেট পাবেন।'
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
      <div className={styles.checkoutResult}>
          <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : verified ? (
            <>
              <div className={styles.resultHeader}>
                <div className={styles.successIcon}>
                  <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                    <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h1 className={styles.resultTitle}>{text[language].title}</h1>
                <p className={styles.resultSubtitle}>{text[language].subtitle}</p>
              </div>

              <div className={styles.orderMessage}>
                <h2>{text[language].thankYou}</h2>
                <p>{text[language].orderConfirmation}</p>
                <p>{text[language].deliveryUpdate}</p>
              </div>

              <div className={styles.actions}>
                <button 
                  onClick={() => navigate('/profile')} 
                  className={`${styles.actionButton} ${styles.primaryButton}`}
                >
                  {text[language].returnToProfile}
                </button>
                <button 
                  onClick={() => navigate('/service')} 
                  className={`${styles.actionButton} ${styles.secondaryButton}`}
                >
                  {text[language].continueShopping}
                </button>
              </div>
            </>
          ) : <Navigate to="/checkout-timeout" />}
        </div>
      </div>
  );
};

export default CheckoutSuccess; 