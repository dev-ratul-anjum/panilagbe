import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Payment.module.css';
import { ToastContainer, toast } from 'react-toastify';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Payment = ({ language }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('onlinePayment');
  const [showAllMonths, setShowAllMonths] = useState({});
  const ordersContainerRef = useRef(null);
  
  // New state for cancel confirmation and review modal
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = currentDate.getFullYear();
  
  // Generate the array of months for the current year
  const allMonths = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    year: currentYear
  }));
  
  // Define month names
  const monthNames = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    bn: [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ]
  };

  // Multilingual text
  const text = {
    en: {
      title: 'Monthly Payments',
      subtitle: 'Manage your water subscription payments',
      ordersTitle: 'Your Active Orders',
      noOrders: 'You don\'t have any active orders yet.',
      startSubscription: 'Start a Order',
      orderNumber: 'Order ID',
      orderDate: 'Started On',
      waterType: 'Water Type',
      waterQuantity: 'Quantity',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      paymentStatus: 'Payment Status',
      paymentHistory: 'Payment History',
      makePayment: 'Make Payment',
      payNow: 'Pay Now',
      orderDetails: 'Order Details',
      deliveryAddress: 'Delivery Address',
      phoneNumber: 'Phone Number',
      monthlyAmount: 'Monthly Amount',
      paymentMethod: 'Payment Method',
      selectPaymentMethod: 'Select Payment Method',
      onlinePayment: 'Online Payment (SSLCommerz)',
      bkash: 'bKash',
      nagad: 'Nagad',
      cash: 'Cash on Delivery',
      closeDetails: 'Close Details',
      paidOn: 'Paid on',
      due: 'Due',
      paid: 'Paid',
      processing: 'Processing...',
      month: 'Month',
      year: 'Year',
      amount: 'Amount',
      tk : 'TK',
      actions: 'Actions',
      viewDetails: 'View Details',
      paymentProcessing: 'Your payment is being processed...',
      errorFetchingOrders: 'Error fetching your orders. Please try again later.',
      noPaymentHistory: 'No payment history found for this subscription.',
      totalPaid: 'Total Paid',
      totalDue: 'Total Due',
      orderSummary: 'Order Summary',
      noOrderSelected: 'Please select an order to view details',
      payForMonth: 'Pay for {month}',
      paymentMethods: 'Payment Methods',
      backToOrders: 'Back to Orders',
      monthlyPaymentStatus: 'Monthly Payment Status',
      paymentDetails: 'Payment Details',
      jar20L: 'Up to 20 liters water delivery',
      jar10L: 'Up to 40 liters water delivery',
      bottle1L: 'Up to 60 liters water delivery',
      waterDeliveryType: 'Water Delivery Type',
      selectMonth: 'Select Month to Pay',
      currentMonth: 'Current Month',
      showAllMonths: 'Show Previous Months',
      hidePreviousMonths: 'Hide Previous Months',
      monthsSinceSubscription: 'Months Since Subscription',
      orderActions: 'Order Actions',
      cancelOrder: 'Cancel Order',
      reviewOrder: 'Review Order',
      cancelConfirmTitle: 'Cancel Order?',
      cancelConfirmMessage: 'Are you sure you want to cancel this order? This action cannot be undone.',
      confirm: 'Confirm',
      cancel: 'Cancel',
      reviewTitle: 'Review Your Order',
      reviewPlaceholder: 'Share your experience with this order...',
      rating: 'Rating',
      submitReview: 'Submit Review',
      reviewSuccess: 'Review submitted successfully!',
      cancelSuccess: 'Order cancelled successfully!',
      error: 'An error occurred. Please try again.'
    },
    bn: {
      title: 'মাসিক পেমেন্ট',
      subtitle: 'আপনার পানি সাবস্ক্রিপশন পেমেন্ট পরিচালনা করুন',
      ordersTitle: 'আপনার সক্রিয় অর্ডার',
      noOrders: 'আপনার এখনও কোন সক্রিয় অর্ডার নেই।',
      startSubscription: 'অর্ডার শুরু করুন',
      orderNumber: 'অর্ডার আইডি',
      orderDate: 'শুরু হয়েছে',
      waterType: 'পানির ধরণ',
      waterQuantity: 'পরিমাণ',
      status: 'অবস্থা',
      active: 'সক্রিয়',
      inactive: 'নিষ্ক্রিয়',
      paymentStatus: 'পেমেন্ট স্ট্যাটাস',
      paymentHistory: 'পেমেন্ট ইতিহাস',
      makePayment: 'পেমেন্ট করুন',
      payNow: 'এখন পেমেন্ট করুন',
      orderDetails: 'অর্ডার বিবরণ',
      deliveryAddress: 'ডেলিভারি ঠিকানা',
      phoneNumber: 'ফোন নম্বর',
      monthlyAmount: 'মাসিক পরিমাণ',
      paymentMethod: 'পেমেন্ট পদ্ধতি',
      selectPaymentMethod: 'পেমেন্ট পদ্ধতি নির্বাচন করুন',
      onlinePayment: 'অনলাইন পেমেন্ট (SSLCommerz)',
      bkash: 'বিকাশ',
      nagad: 'নগদ',
      cash: 'ক্যাশ অন ডেলিভারি',
      closeDetails: 'বিবরণ বন্ধ করুন',
      paidOn: 'পেমেন্ট করা হয়েছে',
      due: 'বাকি',
      paid: 'পরিশোধিত',
      processing: 'প্রক্রিয়াকরণ হচ্ছে...',
      month: 'মাস',
      year: 'বছর',
      amount: 'পরিমাণ',
      tk : '৳',
      actions: 'অ্যাকশন',
      viewDetails: 'বিস্তারিত দেখুন',
      paymentProcessing: 'আপনার পেমেন্ট প্রক্রিয়া করা হচ্ছে...',
      errorFetchingOrders: 'আপনার অর্ডার আনতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
      noPaymentHistory: 'এই সাবস্ক্রিপশনের জন্য কোন পেমেন্ট ইতিহাস পাওয়া যায়নি।',
      totalPaid: 'মোট পরিশোধিত',
      totalDue: 'মোট বাকি',
      orderSummary: 'অর্ডার সারাংশ',
      noOrderSelected: 'বিবরণ দেখতে একটি অর্ডার নির্বাচন করুন',
      payForMonth: '{month} এর জন্য পেমেন্ট করুন',
      paymentMethods: 'পেমেন্ট পদ্ধতি',
      backToOrders: 'অর্ডারে ফিরে যান',
      monthlyPaymentStatus: 'মাসিক পেমেন্ট স্ট্যাটাস',
      paymentDetails: 'পেমেন্ট বিবরণ',
      jar20L: '২০ লিটার পর্যন্ত পানি ডেলিভারি',
      jar10L: '৪০ লিটার পর্যন্ত পানি ডেলিভারি',
      bottle1L: '৬০ লিটার পর্যন্ত পানি ডেলিভারি',
      waterDeliveryType: 'পানি ডেলিভারি ধরণ',
      selectMonth: 'পেমেন্ট করার জন্য মাস নির্বাচন করুন',
      currentMonth: 'বর্তমান মাস',
      showAllMonths: 'আগের মাসগুলি দেখুন',
      hidePreviousMonths: 'আগের মাসগুলি লুকান',
      monthsSinceSubscription: 'সাবস্ক্রিপশন শুরু থেকে মাসগুলি',
      orderActions: 'অর্ডার অ্যাকশন',
      cancelOrder: 'অর্ডার বাতিল করুন',
      reviewOrder: 'রিভিউ দিন',
      cancelConfirmTitle: 'অর্ডার বাতিল করবেন?',
      cancelConfirmMessage: 'আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি বাতিল করতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
      confirm: 'নিশ্চিত করুন',
      cancel: 'বাতিল করুন',
      reviewTitle: 'আপনার অর্ডার রিভিউ করুন',
      reviewPlaceholder: 'এই অর্ডার সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন...',
      rating: 'রেটিং',
      submitReview: 'রিভিউ জমা দিন',
      reviewSuccess: 'রিভিউ সফলভাবে জমা দেওয়া হয়েছে!',
      cancelSuccess: 'অর্ডার সফলভাবে বাতিল করা হয়েছে!',
      error: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
    }
  };

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('panilagbe-token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/api/orders/`, {
          headers: {
            Authorization: token
          }
        });

        setOrders(response.data);
      } catch (err) {
        setError(text[language].errorFetchingOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', options);
  };

  // Get water type label
  const getWaterTypeLabel = (type) => {
    switch (type) {
      case '20L':
        return text[language].jar20L || 'Up to 20 liters';
      case '40L':
        return text[language].jar10L || 'Up to 40 liters';
      case '60L':
        return text[language].bottle1L || 'Up to 60 liters';
      default:
        return type;
    }
  };

  // Check if a month has been paid
  const isMonthPaid = (order, month, year) => {
    if (order.subscription.length === 0) {
      return false;
    }
    
    return order.subscription.some(
      sub => String(sub.paymentMonth) === String(month) && String(sub.paymentYear) === String(year)
    );
  };

  // Get payment status class
  const getPaymentStatusClass = (order, month, year) => {
    return isMonthPaid(order, month, year) ? styles.paid : styles.due;
  };

  // Get month name
  const getMonthName = (month) => {
    return monthNames[language][month - 1];
  };

  // Toggle order details and scroll to orders container
  const toggleOrderDetails = (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId);
      
      // Wait for state update and DOM to render before scrolling
      setTimeout(() => {
        // Find the clicked order header element
        const orderElement = document.getElementById(`order-${orderId}`);
        if (orderElement) {
          // Calculate header height (page title + subtitle) to position just below it
          const headerHeight = 150; // Approximate height of the page title area
          
          // Scroll the order into view with offset to position below the header
          window.scrollTo({
            top: orderElement.getBoundingClientRect().top + window.pageYOffset - headerHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Handle pay now button
  const handlePayNow = async (order, month, year) => {
    try {
      setProcessingPayment(true);
      const token = localStorage.getItem('panilagbe-token');
      
      const paymentData = {
        orderId: order._id,
        paymentMethod: selectedPaymentMethod,
        paymentMonth: month,
        paymentYear: year,
        amount: order.totalAmount
      };
      
      const response = await axios.post(
        `${BACKEND_URL}/api/orders/pay`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          }
        }
      );
      
      // Redirect to payment gateway for online payment
      if (selectedPaymentMethod === 'onlinePayment' && response.data.url) {
        setProcessingPayment(false);
        window.location.href = response.data.url;
      }
      
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setProcessingPayment(false);
    }
  };
  
  // Get count of paid months
  const getPaidMonthsCount = (order) => {
    if (order.subscription.length === 0) {
      return 0;
    }
    return order.subscription.length;
  };

  // Get total paid amount
  const getTotalPaid = (order) => {
    if (order.subscription.length === 0) {
      return 0;
    }
    return order.subscription.length * order.totalAmount;
  };

  // Toggle showing all months for an order
  const toggleShowAllMonths = (orderId) => {
    setShowAllMonths(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Get subscription start date (first month and year)
  const getSubscriptionStartDate = (order) => {
    return {
      month: new Date(order.createdAt).getMonth() + 1,
      year: new Date(order.createdAt).getFullYear()
    };
  };

  // Get months since subscription started till current month
  const getRelevantMonths = (order) => {
    const { month: startMonth, year: startYear } = getSubscriptionStartDate(order);
    const months = [];
    
    // Create month-year pairs from subscription start to current month
    let currentIterationYear = startYear;
    let currentIterationMonth = startMonth;
    
    while (
      currentIterationYear < currentYear || 
      (currentIterationYear === currentYear && currentIterationMonth <= currentMonth)
    ) {
      months.push({
        month: currentIterationMonth,
        year: currentIterationYear
      });
      
      // Move to next month
      if (currentIterationMonth === 12) {
        currentIterationMonth = 1;
        currentIterationYear++;
      } else {
        currentIterationMonth++;
      }
    }
    
    return months;
  };

  // Function to handle cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      setSubmittingAction(true);
      const token = localStorage.getItem('panilagbe-token');
      
      await axios.post(
        `${BACKEND_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      // Show success message
      alert(text[language].cancelSuccess);
      
      // Close confirmation dialog
      setShowCancelConfirm(null);
    } catch (err) {
      alert(text[language].error);
      console.error('Error cancelling order:', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Function to handle review submission
  const handleSubmitReview = async (orderId) => {
    try {
      setSubmittingAction(true);
      const token = localStorage.getItem('panilagbe-token');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/reviews`,
        {
          rating: reviewRating,
          comment: reviewText
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          }
        }
      );
      
      // Show success message
      toast.success(text[language].reviewSuccess, {
        className: 'toast'
      });
      
      // Reset form and close modal
      setReviewText('');
      setReviewRating(0);
      setShowReviewModal(null);
    } catch (err) {
      toast.error(text[language].error, {
        className: 'toast'
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className={styles.paymentContainer} lang={language}>
      <ToastContainer />
      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmDialog}>
            <h3>{text[language].cancelConfirmTitle}</h3>
            <p>{text[language].cancelConfirmMessage}</p>
            <div className={styles.confirmActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowCancelConfirm(null)}
                disabled={submittingAction}
              >
                {text[language].cancel}
              </button>
              <button 
                className={styles.confirmButton}
                onClick={() => handleCancelOrder(showCancelConfirm)}
                disabled={submittingAction}
              >
                {submittingAction ? text[language].processing : text[language].confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.reviewModal}>
            <button 
              className={styles.closeButton} 
              onClick={() => setShowReviewModal(null)}
              aria-label="Close"
            ></button>
            <h3>{text[language].reviewTitle}</h3>
            
            <div className={styles.ratingContainer}>
              <label>{text[language].rating}</label>
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    className={`${styles.star} ${star <= reviewRating ? styles.activeStar : ''}`}
                    onClick={() => setReviewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.reviewTextArea}>
              <textarea
                placeholder={text[language].reviewPlaceholder}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
              />
            </div>
            
            <button 
              className={styles.submitReviewButton}
              onClick={() => handleSubmitReview(showReviewModal)}
              disabled={submittingAction || reviewRating === 0 || !reviewText.trim()}
            >
              {submittingAction ? text[language].processing : text[language].submitReview}
            </button>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{text[language].title}</h1>
        <p className={styles.pageSubtitle}>{text[language].subtitle}</p>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{text[language].processing}</p>
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.noOrders}>
            <p>{text[language].noOrders}</p>
            <button 
              onClick={() => navigate('/service')} 
              className={styles.primaryButton}
            >
              {text[language].startSubscription}
            </button>
          </div>
        ) : (
          <div className={styles.ordersContainer} ref={ordersContainerRef}>
            <h2 className={styles.sectionTitle}>{text[language].ordersTitle}</h2>
            
            <div className={styles.ordersList}>
              {orders.map(order => (
                <div 
                  key={order._id} 
                  className={styles.orderCard}
                >
                  <div 
                    id={`order-${order._id}`}
                    className={styles.orderHeader} 
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <div className={styles.orderBasicInfo}>
                      <div className={styles.orderInfoItem}>
                        <span className={styles.orderInfoLabel}>{text[language].orderNumber}:</span>
                        <span className={styles.orderInfoValue}>#{order._id.substring(order._id.length - 6)}</span>
                      </div>
                      <div className={styles.orderInfoItem}>
                        <span className={styles.orderInfoLabel}>{text[language].orderDate}:</span>
                        <span className={styles.orderInfoValue}>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className={styles.orderInfoItem}>
                        <span className={styles.orderInfoLabel}>{text[language].waterDeliveryType}:</span>
                        <span className={styles.orderInfoValue}>
                          {getWaterTypeLabel(order.items[0].waterType)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.orderStatus}>
                      <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                        {text[language].active}
                      </span>
                      <span className={styles.viewDetailsButton}>
                        {selectedOrder === order._id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  
                  {selectedOrder === order._id && (
                    <div className={styles.orderDetails}>
                      <div className={styles.orderDetailsGrid}>
                        <div className={styles.orderDetailsSection}>
                          <h3 className={styles.orderDetailsSectionTitle}>{text[language].orderDetails}</h3>
                          <div className={styles.orderDetailsInfo}>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>{text[language].waterType}:</span>
                              <span className={styles.detailValue}>
                                {getWaterTypeLabel(order.items[0].waterType)}
                              </span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>{text[language].waterQuantity}:</span>
                              <span className={styles.detailValue}>{order.items[0].waterQuantity}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>{text[language].deliveryAddress}:</span>
                              <span className={styles.detailValue}>{order.deliveryAddress}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>{text[language].phoneNumber}:</span>
                              <span className={styles.detailValue}>{order.phoneNumber}</span>
                            </div>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>{text[language].monthlyAmount}:</span>
                              <span className={styles.detailValue}>{order.totalAmount} TK</span>
                            </div>
                            <div className={styles.paymentSummaryItem}>
                              <span>{text[language].totalPaid} : </span>
                              <span>{getTotalPaid(order)} {text[language].tk}</span>
                            </div>
                            <div className={styles.paymentSummaryItem}>
                              <span>{text[language].paidOn} : </span>
                              <span>{getPaidMonthsCount(order)} {text[language].month}</span>
                            </div>
                            <div className={styles.orderActionsContainer}>
                              <h4 className={styles.orderActionsTitle}>{text[language].orderActions}</h4>
                              <div className={styles.orderActionButtons}>
                                <button 
                                  className={styles.cancelOrderButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCancelConfirm(order._id);
                                  }}
                                >
                                  {text[language].cancelOrder}
                                </button>
                                <button 
                                  className={styles.reviewOrderButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReviewModal(order._id);
                                  }}
                                >
                                  {text[language].reviewOrder}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.orderDetailsSection}>
                          <h3 className={styles.orderDetailsSectionTitle}>{text[language].monthlyPaymentStatus}</h3>
                          
                          {/* Toggle for Showing Previous Months */}
                          <div className={styles.monthsToggle}>
                            <button 
                              className={styles.toggleButton}
                              onClick={() => toggleShowAllMonths(order._id)}
                            >
                              {showAllMonths[order._id] ? text[language].hidePreviousMonths : text[language].showAllMonths}
                              <span className={styles.toggleIcon}>
                                {showAllMonths[order._id] ? '▲' : '▼'}
                              </span>
                            </button>
                          </div>
                          
                          {/* Previous Months Payment Status */}
                          {showAllMonths[order._id] && (
                            <div className={styles.previousMonths}>
                              {getRelevantMonths(order)
                                .filter(({month, year}) => !(month === currentMonth && year === currentYear)) // Exclude current month
                                .map(({month, year}) => (
                                  <div key={`${month}-${year}`} className={styles.monthPaymentItem}>
                                    <div className={styles.monthPaymentHeader}>
                                      <span className={styles.monthYearLabel}>
                                        {getMonthName(month)} {year}
                                      </span>
                                      <span className={`${styles.paymentStatus} ${getPaymentStatusClass(order, month, year)}`}>
                                        {isMonthPaid(order, month, year) 
                                          ? text[language].paid 
                                          : text[language].due}
                                      </span>
                                    </div>
                                    
                                    {!isMonthPaid(order, month, year) && (
                                      <button 
                                        className={styles.payNowButton}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePayNow(order, month, year);
                                        }}
                                        disabled={processingPayment}
                                      >
                                        {processingPayment ? text[language].processing : text[language].payNow}
                                      </button>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                          
                          {/* Current Month Payment Status */}
                          <div className={styles.currentMonthPayment}>
                            <h4 className={styles.currentMonthLabel}>
                              {text[language].currentMonth}: {getMonthName(currentMonth)} {currentYear}
                            </h4>
                            <div className={styles.monthPaymentHeader}>
                              <span className={`${styles.paymentStatus} ${getPaymentStatusClass(order, currentMonth, currentYear)}`}>
                                {isMonthPaid(order, currentMonth, currentYear) 
                                  ? text[language].paid 
                                  : text[language].due}
                              </span>
                              
                              {!isMonthPaid(order, currentMonth, currentYear) && (
                                <button 
                                  className={styles.payNowButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePayNow(order, currentMonth, currentYear);
                                  }}
                                  disabled={processingPayment}
                                >
                                  {processingPayment ? text[language].processing : text[language].payNow}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 