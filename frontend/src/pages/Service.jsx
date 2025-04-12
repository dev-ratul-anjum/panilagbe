import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Service.module.css';
import useAuth from '../hooks/useAuth';
import BlurImage from '../components/BlurImage';
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
                <BlurImage
                  src="/images/one-bottle.png"
                  placeholder="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABAADoDASIAAhEBAxEB/8QAGgAAAwEBAQEAAAAAAAAAAAAAAAYHCAUCA//EADkQAAEDAwIEAwQFDQAAAAAAAAECAwQABREGEgchMUETFGEIIlGBMlJxksEVJSY3YmVydKGxsrPR/8QAGQEAAwEBAQAAAAAAAAAAAAAAAgQFBgAD/8QAIxEAAgIABgIDAQAAAAAAAAAAAQIAAwQFERIhQTFxEzJhsf/aAAwDAQACEQMRAD8A1TRRRXToVlDXvtK6kser7xa7fZLR5aBOehhT5cWtfhrKc+6pIGcZ6d+9advt7t9ihGVdJSGGs7Ug81LV9VKRzUr0AJrI/ENg3CXOeTo1xMiVNkTlKdaSlza4rKUr904VgAnmcFRHxpzC4f5if7E8XiloA7PvSay0dd13/SVkvDrKWF3CEzLU0lW4ILiArAPfGa7FT/hDrKzX7S9rt8RYi3GHEbZcgOgIWjYkJJSOik8uo7EZweVUClnQoxUiM1utihlOohRRRQQ4UtcR9SnSOjLleENB59lKUMtn6KnVqCEbv2dygT6A0y0h8dURl8JtSec2htMbckk4w4FpKCD8d23HrR1gFwDAsJCnSJWl4s8qOotQNJuFzcSNj78rcGQeyEBGEjPYf9J5d8vsFEh0SGl70qIUQonn92vnptu2uaOacfvU8SNo91VycT3+qTSXfRFEmR4dwfcG84zJKs/OrVdYZzr1MxfeUrBHfM8SfLT7x4trbW08gh0KS6W8KB6ghOQfUVdeDWq7peE3ey6hG+5WpTSg+FBXisuglG5QAysbVAnAyMd81nS2eU864X5zzSdnVL6kk8+nKrb7Ov5OXP1k7AkGS75thCnFuqcX4Ya90ZVz25K8fP4UOYKPj9T0yZybD+y00UUVEmmhSHxzhCdwrv6CstqaaTIQoDOFNuJWPllNPlJ3GH9WOpP5Jf4UdXDj3At+h9SdW6VqaXpNt8SbQpsBJALbyVdfRRFT29m8mVJK3oqTvOfDcdxVJ0yv9AW/iEp/yFIGoFnx5XX6aqt0/dgB3MriualYnqcKxvXRE93y7sTxSgZU4XCOvoRVt4GRpJv+sp1wkNvyy9GiktNlCAhDW4YBJOffOcntUVsJ/OTn8H41cuByt0/WJ/eDf+hFDmHCGe2Snc3Mq1FFFQ5p4VNPaOluw+Dl/cZWW9/gMuLHUIW+2lX2ciR86pdcnVtnh6g01cbVcmQ/ElslpxB+B7g9iDgg9iAaJDtYGCw1BEzlZoc1jRCW2rqFtOpSpCnW1oIyQcZSpQP24FI9zhPCS8XLlEKyo5w47yP3KcLlwX1bZvFb0xeGpUInKG3HVxnB8M4yhR9fd+wUpSuGnE9Tyiq2hwqOSrzrJz891X6r6+Tu8zNW4GxiAB49zlRob3mFEXJsYHVsOKP9Qn+9W32YFvs6g1zAXLVKabXDfKyAMOLS5u6E45JSMZPSprauC2vrg4kXGRBtzROFlcguqx6JRyPzIrSHCPREPQ1ifiRlKfkyHQ9JlLSEqeXtAHIckpAGAntz5kkmlsdejJtU6x3L8JZVZvbTxHqiiio8tT//2Q=="
                  alt="20L"
                />
              </div>
              <h3>{text[language].jar20L}</h3>
              <p className={styles.price}>{text[language].waterPrices['20L']} {text[language].tk} {text[language].time}</p>
            </div>
            
            <div className={styles.waterCard} onClick={() => handleOrder('40L')}>
              <div className={styles.waterImage}>
                <BlurImage
                  src="/images/two-bottle.png"
                  placeholder="data:image/jpeg;base64,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"
                  alt="40L"
                />
              </div>
              <h3>{text[language].jar10L}</h3>
              <p className={styles.price}>{text[language].waterPrices['40L']} {text[language].tk} {text[language].time}</p>
            </div>
            
            <div className={styles.waterCard} onClick={() => handleOrder('60L')}>
              <div className={styles.waterImage}>
                <BlurImage 
                  src="/images/three-bottle.png"
                  placeholder="data:image/jpeg;base64,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"
                  alt="60L"
                />
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