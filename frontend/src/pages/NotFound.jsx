import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = ({ language }) => {
  // Multilingual text
  const text = {
    en: {
      title: '404 - Page Not Found',
      message: 'The page you are looking for does not exist or has been moved.',
      homeLink: 'Return to Home Page'
    },
    bn: {
      title: '৪০৪ - পৃষ্ঠা পাওয়া যায়নি',
      message: 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।',
      homeLink: 'হোম পেজে ফিরে যান'
    }
  };

  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.icon}>404</div>
        <h1>{text[language].title}</h1>
        <p>{text[language].message}</p>
        <Link to="/" className={styles.homeButton}>
          {text[language].homeLink}
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 