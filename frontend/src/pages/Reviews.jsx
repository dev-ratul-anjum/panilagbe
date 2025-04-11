import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Reviews.module.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Reviews = ({ language }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('newest');

  // Multilingual text
  const text = {
    en: {
      pageTitle: 'Customer Reviews',
      pageSubtitle: 'See what our customers are saying about our services',
      loading: 'Loading reviews...',
      error: 'Error loading reviews. Please try again later.',
      noReviews: 'No reviews found. Be the first to review our services!',
      filterBy: 'Filter by:',
      highest: 'Highest Rating',
      lowest: 'Lowest Rating',
      newest: 'Most Recent',
      rating: 'rating',
      outOf: 'out of 5',
    },
    bn: {
      pageTitle: 'গ্রাহক রিভিউসমূহ',
      pageSubtitle: 'আমাদের সেবা সম্পর্কে আমাদের গ্রাহকরা কী বলছেন',
      loading: 'রিভিউ লোড হচ্ছে...',
      error: 'রিভিউ লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
      noReviews: 'কোন রিভিউ পাওয়া যায়নি। আমাদের সেবা সম্পর্কে প্রথম রিভিউ দিন!',
      filterBy: 'ফিল্টার করুন:',
      highest: 'সর্বোচ্চ রেটিং',
      lowest: 'সর্বনিম্ন রেটিং',
      newest: 'সাম্প্রতিক',
      rating: 'রেটিং',
      outOf: '৫ এর মধ্যে',
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', options);
  };

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/reviews`);
        setReviews(response.data);
        setError(null);
      } catch (err) {
        setError(text[language].error);
        toast.error(text[language].error, {
          className: 'toast'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [language]);

  // Filter reviews based on current filter
  const sortedReviews = [...reviews].sort((a, b) => {
    if (filter === 'highest') {
      return b.rating - a.rating;
    } else if (filter === 'lowest') {
      return a.rating - b.rating;
    } else {
      // newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${styles.star} ${i <= rating ? styles.activeStar : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getUserInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className={styles.reviewsContainer} lang={language}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>{text[language].pageTitle}</h1>
          <p className={styles.pageSubtitle}>{text[language].pageSubtitle}</p>
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{text[language].loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.reviewsContainer} lang={language}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>{text[language].pageTitle}</h1>
          <p className={styles.pageSubtitle}>{text[language].pageSubtitle}</p>
          <div className={styles.errorMessage}>
            <p>{text[language].error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer} lang={language}>
      <ToastContainer />
      
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{text[language].pageTitle}</h1>
        <p className={styles.pageSubtitle}>{text[language].pageSubtitle}</p>

        {sortedReviews.length > 0 ? (
          <>
            <div className={styles.filterContainer}>
              <span className={styles.filterLabel}>{text[language].filterBy}</span>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterButton} ${filter === 'newest' ? styles.active : ''}`}
                  onClick={() => setFilter('newest')}
                >
                  {text[language].newest}
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'highest' ? styles.active : ''}`}
                  onClick={() => setFilter('highest')}
                >
                  {text[language].highest}
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'lowest' ? styles.active : ''}`}
                  onClick={() => setFilter('lowest')}
                >
                  {text[language].lowest}
                </button>
              </div>
            </div>

            <div className={styles.reviewsList}>
              {sortedReviews.map((review) => (
                <div key={review._id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.userAvatar}>
                        {getUserInitials(review.userName)}
                      </div>
                      <div className={styles.userData}>
                        <h3 className={styles.userName}>{review.userName}</h3>
                        <p className={styles.reviewDate}>{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>
                      <div className={styles.starsContainer}>
                        {renderStars(review.rating)}
                      </div>
                      <span className={styles.ratingText}>
                        {review.rating} {text[language].rating} {text[language].outOf}
                      </span>
                    </div>
                  </div>
                  <div className={styles.reviewContent}>
                    <p>{review.reviewText}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.noReviews}>
            <p>{text[language].noReviews}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews; 