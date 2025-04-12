import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';
import BackgroundImage from '../components/BackgroundImage';
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

      <BackgroundImage
          src="images/pani-lagbe-cover.png"
          placeholder="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA6AEADASIAAhEBAxEB/8QAHAAAAgIDAQEAAAAAAAAAAAAABQYEBwECAwAI/8QAMBAAAgEEAQMCBAUEAwAAAAAAAQIDAAQFESEGEjFBURMUIjIHYWKBkRUkcaEz0eH/xAAaAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QAIhEAAgICAQQDAQAAAAAAAAAAAQIAAwQRIQUSEzEUMkGB/9oADAMBAAIRAxEAPwBPjWimMs2uJlQA8+ahW6dzCrC6UxOlV2X6j5rU3WCtdzziik5FgQev2FMDiexFAWnXG4/WvprbG2SQw97gaA9fWmOyhR4wyaIPtSG20sZtMfGVFAE4W1sFA4qfGmhoV2WECtiv08VQTuGhQJxY6FB8pIAjURMyvExXwGZf3B1S5m7gKjc1ZWNmUXv2rPn3DxB7lARsb5q4OmbcBU4qncfL8JZGUkOF4158ira6cyEhZFCgnQJCjZppnMZmuiqNkmOdyjbgQb7CrEj04K/+0S6d7vmLxGY/DUIQCeBsvs/6FL9t1Hi7/IvZ2t5DNeWhEd3Erc2/fyvd7b7akXXUeOwk0nzbSMLgAAxJ3a0T5/mlOieBNR3KvJPEaMveLjrX4xjMn1hNA680Itc6ZYJfmEMZRGfvBB9dAa/ilKbri2uxkI7t5mha4R7YCLlUC6O+fcb/AHrFt1FiJba5Et3HbAR/dcssSklhwCx1v8qnxMByJz8hGOlaMuPupJYJ2lYnbdwBHgkndLHUt32xufapbZaK1kiT4iNbTptZFYMu+/g7HGtbpL6rvSlu0byh5TvnxuisZO5os6lf46iZX+FjSS6VZGfRHOjrdWIcfFeW6SXYtp7OFS7RTQtI5bRGwQw159jVZ46XsuEP505/1+PHYueV7mOAqmw7kaFGZa7IizpT6DD9jHi7i2iureS1toP7YAKny/wwE9VBLcbFQGxGPs8e1pibSaF5LqS6HdP8YsWXleWJHjjXG/QUr2fXlreGSK5vLXLIo2IIHHcP1cen/ddJOrsPa3NrcvYfIxI53PIx7R9J96F0vsRiWf6tCMtvNEqtLDIit9pZSAaVevMzF07YY3LXGOhyMdtfpu2n4R9xSjzo+N7/AGrFv1DD1di5sJjrm3E/y/xVke6eFUcM3bsoe48t4HpRCH8NMSwhe9zufuApSSS3N4HhZhyRorsrvY5O9etcu5IKiW0UhWDsf5Fj8P8A8UsbL1S2OusIcbiMlLGLeK3uCyWkx2rMAR9jsQSBoAgkDk09dYNGk4WN5CV2NM26452KLIRWy5CC4tTYypPFJHMu3kViQRontUjgqNensKA5O9e5md3PJO/8UXg1EEsYp61kK+q0HJ9wbCxVtj05pks3V4x3KrD2YA0sp5o/j/8AiWrsgcQbAOrCJnJ4WzyMJjLTWnO+607Yj/IWh1l0Vjre4SaW+yl2U2Ql1Osic/p7dUeHit6AKg8x8LCBqetbLHWmvl7CyjI9Ut0U/wChUw3ZVdKdD8qhkn3rVvtqQJDMdSBmrpnAG/WgUjbNE8r5H+aEmmeP9Zm8rm4mf//Z"
          className={styles.hero}
        >
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
        </BackgroundImage>

      {/* Service Areas Section */}
      <section className={styles.serviceAreas}>
        <div className={styles.container}>
          <h2>{text[language].serviceAreas}</h2>
          <p>{text[language].serviceAreaText}</p>
          <div className={styles.mapContainer}>
            <img src='images/service-area-map.jpg' alt="Service Area Map" />
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