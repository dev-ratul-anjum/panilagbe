import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Service.module.css';
import useAuth from '../hooks/useAuth';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Service = ({ language }) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  
  // Add ref for order section
  const orderSectionRef = useRef(null);

  const [orderData, setOrderData] = useState({
    waterType: '20L',
    waterQuantity: '5L',
    name: user ? user.name : '',
    email: user ? user.email : '',
    deliveryAddress: user ? user.address : '',
    phoneNumber: user ? user.phone : '',
    paymentMethod: 'onlinePayment',
    paymentType: 'payNow'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    deliveryAddress : null,
    phoneNumber : null,
    common : null,
    paymentMethodAvailable : null
  });
  
  // Order success state
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Function to close the order confirmation modal
  const handleCloseModal = () => {
    setOrderSuccess(false);
    window.location.href = '/';
  };
  
  // Multilingual text
  const text = {
    en: {
      title: 'Our Services',
      subtitle: 'Choose your preferred water delivery option',
      waterTypesTitle: 'Available Water Types',
      jar20L: 'Up to 20 liters water delivery',
      jar10L: 'Up to 40 liters water delivery',
      bottle1L: 'Up to 60 liters water delivery',
      orderTitle: 'Place Your Order',
      waterType: 'Delivery Type',
      quantity: 'Water Quantity',
      name: 'Full Name',
      email: 'Email Address',
      deliveryAddress: 'Delivery Address',
      phoneNumber: 'Phone Number',
      paymentType: 'Payment Type',
      payNow: 'Pay Now',
      payLater: 'Pay Later',
      paymentMethod: 'Payment Method',
      cash: 'Cash on Delivery',
      bKash: 'bKash',
      nagad: 'Nagad',
      paymentMethodMessage : 'This service is not yet active.',
      onlinePayment: 'SSLCommerz',
      totalAmount: 'Amount ',
      tk: 'Tk',
      time : '(Monthly)',
      placeOrder: 'Place Order',
      loginRequired: 'Please login to place an order',
      login: 'Login',
      orderSuccess: 'Thank You for Your Order!',
      orderProcessing: 'Your order has been placed successfully and is being processed.',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      orderStatus: 'Order Status',
      processing: 'Processing',
      shippingInfo: 'Shipping Information',
      phone: 'Phone',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'Tax',
      shipping: 'Shipping',
      total: 'Total',
      free: 'Free',
      waterQuantity : {
        '20L': [
          '5 Liter',
          '8 Liter',  
          '10 Liter',
          '13 Liter',
          '16 Liter',
          '18 Liter',
          '20 Liter'
        ],
        '40L': [
          '25 Liter',
          '28 Liter',
          '30 Liter',
          '36 Liter',
          '38 Liter',
          '40 Liter'
        ],
        '60L': [
          '45 Liter',
          '46 Liter',
           '48 Liter',
           '50 Liter',
          '55 Liter',
          '58 Liter',
           '60 Liter',
      ]
      
      },
      waterPrices: {
        '20L': 100,
        '40L': 200,
        '60L': 300
      },
      close: 'Close',
      orderConfirmed: 'Order Confirmed!',
      deliveryInfo: 'Your water will be delivered to:',
      emailConfirmation: 'A confirmation message has been sent to your email.',
      deliveryStart: 'Your water delivery will start from next month.',
    },
    bn: {
      title: 'আমাদের সেবাসমূহ',
      subtitle: 'আপনার পছন্দের পানি ডেলিভারি অপশন বেছে নিন',
      waterTypesTitle: 'উপলব্ধ পানির ধরণ',
      jar20L: '২০ লিটার পর্যন্ত পানি ডেলিভারি',
      jar10L: '৪০ লিটার পর্যন্ত পানি ডেলিভারি',
      bottle1L: '৬০ লিটার পর্যন্ত পানি ডেলিভারি',
      orderTitle: 'আপনার অর্ডার দিন',
      waterType: 'ডেলিভারি ধরণ',
      quantity: 'পানির পরিমাণ',
      name: 'পূর্ণ নাম',
      email: 'ইমেইল ঠিকানা',
      deliveryAddress: 'ডেলিভারি ঠিকানা',
      phoneNumber: 'ফোন নম্বর',
      paymentType: 'পেমেন্ট টাইপ',
      payNow: 'এখন পেমেন্ট করুন',
      payLater: 'পরে পেমেন্ট করুন',
      paymentMethod: 'পেমেন্ট পদ্ধতি',
      cash: 'ক্যাশ অন ডেলিভারি',
      bKash: 'বিকাশ',
      nagad: 'নগদ',
      paymentMethodMessage : 'এই সেবাটি এখনও সক্রিয় হয়নি।',
      onlinePayment: 'SSLCOMMERZ',
      totalAmount: 'পরিমাণ ',
      tk: 'টাকা',
      time : '(মাসিক)',
      placeOrder: 'অর্ডার দিন',
      loginRequired: 'অর্ডার দিতে দয়া করে লগইন করুন',
      login: 'লগইন',
      orderSuccess: 'আপনার অর্ডারের জন্য ধন্যবাদ!',
      orderProcessing: 'আপনার অর্ডার সফলভাবে প্লেস করা হয়েছে এবং প্রক্রিয়াধীন আছে।',
      orderNumber: 'অর্ডার নম্বর',
      orderDate: 'অর্ডারের তারিখ',
      orderStatus: 'অর্ডারের অবস্থা',
      processing: 'প্রক্রিয়াধীন',
      shippingInfo: 'শিপিং তথ্য',
      phone: 'ফোন',
      orderSummary: 'অর্ডার সারাংশ',
      subtotal: 'সাবটোটাল',
      tax: 'কর',
      shipping: 'শিপিং',
      total: 'মোট',
      free: 'ফ্রি',
      waterQuantity : {
        '20L': [
           '৫ লিটার',
           '৮ লিটার',  
          '১০ লিটার',
           '১৩ লিটার',
           '১৬ লিটার',
         '১৮ লিটার',
          '২০ লিটার'
        ],
        '40L': [
           '২৫ লিটার',
           '২৮ লিটার',
           '৩০ লিটার',
           '৩৬ লিটার',
           '৩৮ লিটার',
           '৪০ লিটার',
        ],
        '60L': [
          '৪৫ লিটার',
          '৪৬ লিটার',
          '৪৮ লিটার',
          '৫০ লিটার',
           '৫৫ লিটার',
           '৫৮ লিটার',
           '৬০ লিটার',
        ],
      },
      waterPrices: {
        '20L': '১০০',
        '40L': '২০০',
        '60L': '৩০০'
      },
      close: 'বন্ধ করুন',
      orderConfirmed: 'অর্ডার নিশ্চিত করা হয়েছে!',
      deliveryInfo: 'আপনার পানি এই ঠিকানায় পৌঁছে দেওয়া হবে:',
      emailConfirmation: 'আপনার ইমেইলে একটি নিশ্চিতকরণ বার্তা পাঠানো হয়েছে।',
      deliveryStart: 'আপনার পানি ডেলিভারি আগামী মাস থেকে শুরু হবে।',
    }
};
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'paymentType') {
      // Reset payment method when payment type changes
      let defaultPaymentMethod = value === 'payNow' ? 'onlinePayment' : 'cash';
      
      setOrderData({
        ...orderData,
        paymentType: value,
        paymentMethod: defaultPaymentMethod
      });
    } else {
      setOrderData({
        ...orderData,
        [name]: value
      });
    }
  };
  
  // Calculate total amount
  const calculateTotal = () => {
    function banglaToEnglishNumber(banglaNumber) {
      const banglaDigits = "০১২৩৪৫৬৭৮৯";
      const englishDigits = "0123456789";
    
      return banglaNumber.replace(/[০-৯]/g, (digit) => englishDigits[banglaDigits.indexOf(digit)]);
    }

    const price = text[language].waterPrices[orderData.waterType];
    const englishPrice = typeof(price) === 'string' ? banglaToEnglishNumber(price) : price;

    return englishPrice;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if(orderData.paymentMethod === 'cash' || orderData.paymentMethod === 'onlinePayment'){
      try {
        setLoading(true);
        
        const token = localStorage.getItem('panilagbe-token');
        let orderPayload;
        if(orderData.paymentType === 'payNow'){
           orderPayload = {
            items: [
              {
                waterType: orderData.waterType,
                waterQuantity: orderData.waterQuantity,
              }
            ],
            name: orderData.name,
            email: orderData.email,
            deliveryAddress: orderData.deliveryAddress,
            phoneNumber: orderData.phoneNumber,
            totalAmount: calculateTotal(),
            paymentMethod: orderData.paymentMethod,
            subscription : {
              paymentMonth : new Date().getMonth() + 1,
              paymentYear : new Date().getFullYear()
            }
          };
        }else if(orderData.paymentType === 'payLater'){
           orderPayload = {
            items: [
              {
                waterType: orderData.waterType,
                waterQuantity: orderData.waterQuantity,
              }
            ],
            name: orderData.name,
            email: orderData.email,
            deliveryAddress: orderData.deliveryAddress,
            phoneNumber: orderData.phoneNumber,
            totalAmount: calculateTotal(),
            paymentMethod: orderData.paymentMethod
          };
        }
  
        const response = await axios.post(
          `${BACKEND_URL}/api/orders`,
          orderPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            }
          }
        );
  
        if(orderData.paymentMethod === 'cash'){
          // Show success modal
          setOrderSuccess(true);
        }else if(orderData.paymentMethod === 'onlinePayment'){
          window.location.href = response.data.url;
        }
  
        // Set order details for the success modal
        const orderDate = new Date().toLocaleDateString();
        const orderNumber = `${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10000)}`;
        
        setOrderDetails({
          orderNumber: orderNumber,
          orderDate: orderDate,
          paymentMethod: orderData.paymentMethod,
          name: user.name,
          address: orderData.deliveryAddress,
          city: language === 'en' ? 'Dhaka' : 'ঢাকা',
          country: language === 'en' ? 'Bangladesh' : 'বাংলাদেশ',
          phone: orderData.phoneNumber,
          email: user.email,
          subtotal: calculateTotal(),
          tax: Math.floor(calculateTotal() * 0.1),
          shipping: 0,
          total: Math.floor(calculateTotal() * 1.1)
        });
        
        
        // Hide after some seconds
        setTimeout(() => {
          setOrderSuccess(false);
          window.location.href = '/';
        }, 300000);
        
        // Reset form
        setOrderData({
          waterType: '20L',
          waterQuantity: '5L',
          name: '',
          email: '',
          deliveryAddress: '',
          phoneNumber: '',
          paymentMethod: 'onlinePayment',
          paymentType: 'payNow'
        });
  
        setErrors({
          name: null,
          email: null,
          deliveryAddress : null,
          phoneNumber : null,
          common : null,
          paymentMethodAvailable : null
        });
        
      } catch (err) {
        setErrors({
          ...errors,
          name: err.response?.data?.errors?.name?.msg,
          email: err.response?.data?.errors?.email?.msg,
          deliveryAddress : err.response?.data?.errors?.deliveryAddress?.msg,
          phoneNumber : err.response?.data?.errors?.phoneNumber?.msg,
          common : err.response?.data?.errors?.common?.msg
        });
      }finally{
        setLoading(false);
      }
    }else{
      console.log('payment method not found');
      setErrors({
        ...errors,
        paymentMethodAvailable : text[language].paymentMethodMessage
      });
    }
    
  };
  
  // Hide success modal after a certain time
  useEffect(() => {
    if (orderSuccess) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [orderSuccess]);
  
  // Handle clicking on water card
  const handleOrder = (waterType) => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Set the selected water type
    setOrderData({
      ...orderData,
      waterType: waterType,
      waterQuantity: text[language].waterQuantity[waterType][0] // Set first quantity option
    });
    
    // Scroll to order section with smooth behavior
    orderSectionRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Focus on the name field instead of textarea or phoneNumber
    setTimeout(() => {
      const nameInput = orderSectionRef.current.querySelector('input[name="name"]');
      if (nameInput) {
        nameInput.focus();
      }
    }, 800);
  };
  
  return (
    <div className={styles.service}>
      {orderSuccess && orderDetails && (
        <div className={styles.orderSuccessOverlay}>
          <div className={styles.orderSuccessModal} lang={language}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseModal}
              aria-label={text[language].close}
            ></button>
            
            <div className={styles.successIconContainer}>
              <div className={styles.successCircleIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="40" height="40">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            
            <h2 className={styles.orderSuccessHeading}>{text[language].orderConfirmed}</h2>
            
            <div className={styles.confirmationMessage}>
              <p className={styles.deliveryAddressLabel}>{text[language].deliveryInfo}</p>
              <p className={styles.deliveryAddress}>{orderDetails.address}</p>
              
              <div className={styles.confirmationInfo}>
                <p>{text[language].emailConfirmation}</p>
                <p>{text[language].deliveryStart}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.container}>
        <h1 className={styles.title}>{text[language].title}</h1>
        <p className={styles.subtitle}>{text[language].subtitle}</p>
        
        <div className={styles.waterTypes}>
          <h2>{text[language].waterTypesTitle}</h2>
          <div className={styles.waterGrid}>
            <div className={styles.waterCard} onClick={() => handleOrder('20L')}>
              <div className={styles.waterImage}>
                <img src="/images/one-bottle.png" alt="20L" />
              </div>
              <h3>{text[language].jar20L}</h3>
              <p className={styles.price}>{text[language].waterPrices['20L']} {text[language].tk} {text[language].time}</p>
            </div>
            
            <div className={styles.waterCard} onClick={() => handleOrder('40L')}>
              <div className={styles.waterImage}>
                <img src="/images/two-bottle.png" alt="40L" />
              </div>
              <h3>{text[language].jar10L}</h3>
              <p className={styles.price}>{text[language].waterPrices['40L']} {text[language].tk} {text[language].time}</p>
            </div>
            
            <div className={styles.waterCard} onClick={() => handleOrder('60L')}>
              <div className={styles.waterImage}>
                <img src="/images/three-bottle.png" alt="60L" />
              </div>
              <h3>{text[language].bottle1L}</h3>
              <p className={styles.price}>{text[language].waterPrices['60L']} {text[language].tk} {text[language].time}</p>
            </div>
          </div>
        </div>
        
        <div className={styles.orderSection} ref={orderSectionRef}>
          <h2>{text[language].orderTitle}</h2>
          
          {user ? (
            <form onSubmit={handleSubmit} className={styles.orderForm}>
              <div className={styles.formGroup}>
                <label htmlFor="waterType">{text[language].waterType}</label>
                <select
                  id="waterType"
                  name="waterType"
                  value={orderData.waterType}
                  onChange={handleChange}
                >
                  <option value="20L">{text[language].jar20L}</option>
                  <option value="40L">{text[language].jar10L}</option>
                  <option value="60L">{text[language].bottle1L}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity">{text[language].quantity}</label>
                <select
                  id="waterQuantity"
                  name="waterQuantity"
                  value={orderData.waterQuantity}
                  onChange={handleChange}
                >
                  {text[language].waterQuantity[orderData.waterType].map((opt, index)=>{
                    return <option value={opt} key={index}>{opt}</option>
                  })}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="name">{text[language].name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={orderData.name}
                  onChange={handleChange}
                />
              </div>

              {errors.name && <div className={styles.error}>{errors.name}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="email">{text[language].email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={orderData.email}
                  onChange={handleChange}
                />
              </div>

              {errors.email && <div className={styles.error}>{errors.email}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="deliveryAddress">{text[language].deliveryAddress}</label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={orderData.deliveryAddress}
                  onChange={handleChange}
                />
              </div>

              {errors.deliveryAddress && <div className={styles.error}>{errors.deliveryAddress}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">{text[language].phoneNumber}</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={orderData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              {errors.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="paymentType">{text[language].paymentType}</label>
                <div className={styles.paymentTypeOptions}>
                  <div 
                    className={`${styles.paymentTypeOption} ${orderData.paymentType === 'payNow' ? styles.active : ''}`}
                    onClick={() => handleChange({ target: { name: 'paymentType', value: 'payNow' } })}
                  >
                    <span className={styles.radioCircle}></span>
                    <span className={styles.pay}>{text[language].payNow}</span>
                  </div>
                  <div 
                    className={`${styles.paymentTypeOption} ${orderData.paymentType === 'payLater' ? styles.active : ''}`}
                    onClick={() => handleChange({ target: { name: 'paymentType', value: 'payLater' } })}
                  >
                    <span className={styles.radioCircle}></span>
                    <span className={styles.pay}>{text[language].payLater}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="paymentMethod">{text[language].paymentMethod}</label>
                {orderData.paymentType === 'payLater' ? (
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={orderData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="cash">{text[language].cash}</option>
                  </select>
                ) : (
                  <div className={styles.paymentMethodGrid}>
                    <div 
                      className={`${styles.paymentMethodCard} ${orderData.paymentMethod === 'onlinePayment' ? styles.active : ''}`}
                      onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'onlinePayment' } })}
                    >
                      <div className={styles.paymentMethodIcon}>
                        <img src="/images/sslcommerz.png" alt="sslcommerz" className={styles.paymentMethodIconImage}/>
                      </div>
                      <div className={styles.paymentMethodLabel}>
                        {text[language].onlinePayment}
                      </div>
                    </div>
                    
                    <div 
                      className={`${styles.paymentMethodCard} ${orderData.paymentMethod === 'bKash' ? styles.active : ''}`}
                      onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'bKash' } })}
                    >
                      <div className={styles.paymentMethodIcon}>
                        <img src="/images/bkash.png" alt="bkash" className={styles.paymentMethodIconImage}/>

                      </div>
                      <div className={styles.paymentMethodLabel}>
                        {text[language].bKash}
                      </div>
                    </div>
                    
                    <div 
                      className={`${styles.paymentMethodCard} ${orderData.paymentMethod === 'Nagad' ? styles.active : ''}`}
                      onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'Nagad' } })}
                    >
                      <div className={styles.paymentMethodIcon}>
                        <img src="/images/nagad.png" alt="nagad" className={styles.paymentMethodIconImage}/>

                      </div>
                      <div className={styles.paymentMethodLabel}>
                        {text[language].nagad}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.totalAmount}>
                <h3>{text[language].totalAmount}: {calculateTotal()} {text[language].tk} {text[language].time}</h3>
              </div>

              {errors.paymentMethodAvailable && <div className={styles.error}>{errors.paymentMethodAvailable}</div>}
              {errors.common && <div className={styles.error}>{errors.common}</div>}
              
              <button 
                type="submit" 
                className={styles.orderButton}
                disabled={loading}
              >
                {loading ? '...' : text[language].placeOrder}
              </button>
            </form>
          ) : (
            <div className={styles.loginRequired}>
              <p>{text[language].loginRequired}</p>
              <button 
                onClick={() => navigate('/login')}
                className={styles.loginButton}
              >
                {text[language].login}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Service; 