import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';
import heroImage from '../assets/pani-lagbe-cover.png';
import serviceAreaMap from '../assets/service-area-map.jpg';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = ({ language }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Multilingual text
  const text = {
    en: {
      heroTitle: 'Clean Water Delivered to Your Doorstep',
      heroSubtitle: 'Fast, reliable water delivery service in Dhaka city',
      orderNow: 'Order Now',
      learnMore: 'Learn More',
      serviceAreas: 'Service Areas',
      serviceAreaText: 'We currently deliver to the following areas in Dhaka city',
      ourServices: 'Our Services',
      waterDelivery: 'Water Delivery',
      waterDeliveryText: 'Get purified water delivered to your home or office',
      subscription: 'Monthly Subscription',
      subscriptionText: 'Regular water delivery with special discounts',
      emergency: 'Emergency Delivery',
      emergencyText: 'Quick delivery during water crisis',
      reviews: 'Customer Reviews',
      viewAllReviews: 'View All Reviews',
      noReviews: 'No reviews yet. Be the first to leave a review!'
    },
    bn: {
      heroTitle: 'আপনার দরজায় বিশুদ্ধ পানি সরবরাহ',
      heroSubtitle: 'ঢাকা শহরে দ্রুত, নির্ভরযোগ্য পানি ডেলিভারি সেবা',
      orderNow: 'অর্ডার করুন',
      learnMore: 'আরও জানুন',
      serviceAreas: 'সেবা এলাকাসমূহ',
      serviceAreaText: 'আমরা বর্তমানে ঢাকা শহরের নিম্নলিখিত এলাকায় ডেলিভারি করি',
      ourServices: 'আমাদের সেবাসমূহ',
      waterDelivery: 'পানি ডেলিভারি',
      waterDeliveryText: 'আপনার বাসা বা অফিসে বিশুদ্ধ পানি পৌঁছে দিন',
      subscription: 'মাসিক সাবস্ক্রিপশন',
      subscriptionText: 'বিশেষ ছাড়ে নিয়মিত পানি ডেলিভারি',
      emergency: 'জরুরী ডেলিভারি',
      emergencyText: 'পানি সঙ্কটের সময় দ্রুত ডেলিভারি',
      reviews: 'গ্রাহক পর্যালোচনা',
      viewAllReviews: 'সমস্ত পর্যালোচনা দেখুন',
      noReviews: 'এখনো কোন পর্যালোচনা নেই। প্রথম পর্যালোচনা করুন!'
    }
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/reviews`);
        setReviews(response.data.slice(0, 3)); // Get the 3 most recent reviews
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', options);
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <div className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroContent}>
          <h1>{text[language].heroTitle}</h1>
          <p>{text[language].heroSubtitle}</p>
          <div className={styles.heroButtons}>
            <Link to="/service" className={styles.primaryButton}>
              {text[language].orderNow}
            </Link>
            <Link to="/about" className={styles.secondaryButton}>
              {text[language].learnMore}
            </Link>
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <section className={styles.serviceAreas}>
        <div className={styles.container}>
          <h2>{text[language].serviceAreas}</h2>
          <p>{text[language].serviceAreaText}</p>
          <div className={styles.mapContainer}>
            <img src={serviceAreaMap} alt="Service Area Map" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2>{text[language].ourServices}</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <i className="fas fa-water"></i>
              </div>
              <h3>{text[language].waterDelivery}</h3>
              <p>{text[language].waterDeliveryText}</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>{text[language].subscription}</h3>
              <p>{text[language].subscriptionText}</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <i className="fas fa-truck"></i>
              </div>
              <h3>{text[language].emergency}</h3>
              <p>{text[language].emergencyText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={styles.reviews}>
        <div className={styles.container}>
          <h2>{text[language].reviews}</h2>
          
          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : reviews.length > 0 ? (
            <>
              <div className={styles.reviewGrid}>
                {reviews.map((review) => (
                  <div key={review._id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <h3>{review.user.name}</h3>
                      <div className={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={i < review.rating ? styles.starFilled : styles.starEmpty}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewText}>{review.text}</p>
                    <p className={styles.reviewDate}>{formatDate(review.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className={styles.viewAll}>
                <Link to="/reviews">{text[language].viewAllReviews}</Link>
              </div>
            </>
          ) : (
            <p className={styles.noReviews}>{text[language].noReviews}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 