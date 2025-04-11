import styles from './About.module.css';

const About = ({ language }) => {
  // Multilingual text
  const text = {
    en: {
      title: 'About Us',
      subtitle: 'Your trusted water delivery service in Dhaka',
      ourStory: 'Our Story',
      storyText: 'Pani Lagbe was founded in 2025 with a simple mission: to provide clean, safe drinking water to the residents of Dhaka. We recognized the challenges people face in obtaining reliable water supplies, especially during water shortages and crises.',
      storyText2: 'Starting with just two delivery vehicles and a small team, we have grown to become one of the most trusted water delivery services in the city. Our commitment to quality, reliability, and customer satisfaction has been the cornerstone of our success.',
      ourMission: 'Our Mission',
      missionText: 'To deliver clean, safe drinking water to homes and businesses across Dhaka, ensuring that everyone has access to this essential resource when they need it.',
      ourVision: 'Our Vision',
      visionText: 'To be the leading water delivery service in Bangladesh, recognized for our reliability, quality, and commitment to customer satisfaction.',
      ourValues: 'Our Values',
      value1Title: 'Quality',
      value1Text: 'We source our water from Dhaka WASA booths, ensuring that it meets all safety standards and is suitable for consumption.',
      value2Title: 'Reliability',
      value2Text: 'We understand that water is an essential resource, which is why we strive to deliver on time, every time.',
      value3Title: 'Customer Satisfaction',
      value3Text: 'Our customers are at the heart of everything we do. We are committed to providing exceptional service and addressing any concerns promptly.',
      ourTeam: 'Our Team',
      teamText: 'Our dedicated team works tirelessly to ensure that you receive the best service possible. From our delivery personnel to our customer service representatives, everyone at Pani Lagbe is committed to your satisfaction.'
    },
    bn: {
      title: 'আমাদের সম্পর্কে',
      subtitle: 'ঢাকায় আপনার বিশ্বস্ত পানি ডেলিভারি সেবা',
      ourStory: 'আমাদের গল্প',
      storyText: 'পানি লাগবে ২০২৫ সালে একটি সহজ লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়েছিল: ঢাকার বাসিন্দাদের জন্য পরিষ্কার, নিরাপদ খাবার পানি সরবরাহ করা। আমরা পানির ঘাটতি এবং সংকটের সময় বিশেষ করে নির্ভরযোগ্য পানি সরবরাহ পাওয়ার ক্ষেত্রে মানুষের সমস্যাগুলি উপলব্ধি করেছি।',
      storyText2: 'মাত্র দুটি ডেলিভারি গাড়ি এবং একটি ছোট দল নিয়ে শুরু করে, আমরা শহরের অন্যতম বিশ্বস্ত পানি ডেলিভারি সেবা হয়ে উঠেছি। মান, নির্ভরযোগ্যতা এবং গ্রাহক সন্তুষ্টির প্রতি আমাদের প্রতিশ্রুতি আমাদের সাফল্যের ভিত্তি হয়ে দাঁড়িয়েছে।',
      ourMission: 'আমাদের লক্ষ্য',
      missionText: 'ঢাকার বাড়ি এবং ব্যবসা প্রতিষ্ঠানে পরিষ্কার, নিরাপদ খাবার পানি সরবরাহ করা, যাতে প্রত্যেকেরই প্রয়োজনের সময় এই অপরিহার্য সম্পদের অ্যাক্সেস থাকে।',
      ourVision: 'আমাদের দৃষ্টিভঙ্গি',
      visionText: 'বাংলাদেশের অগ্রণী পানি ডেলিভারি সেবা হওয়া, আমাদের নির্ভরযোগ্যতা, মান এবং গ্রাহক সন্তুষ্টির প্রতি প্রতিশ্রুতির জন্য স্বীকৃত।',
      ourValues: 'আমাদের মূল্যবোধ',
      value1Title: 'মান',
      value1Text: 'আমরা ঢাকা ওয়াসা বুথ থেকে আমাদের পানি সংগ্রহ করি, যাতে এটি সমস্ত নিরাপত্তা মান পূরণ করে এবং ভোগের জন্য উপযুক্ত হয়।',
      value2Title: 'নির্ভরযোগ্যতা',
      value2Text: 'আমরা বুঝি যে পানি একটি অপরিহার্য সম্পদ, যার জন্য আমরা প্রতিবার সময়মতো ডেলিভারি করার চেষ্টা করি।',
      value3Title: 'গ্রাহক সন্তুষ্টি',
      value3Text: 'আমাদের গ্রাহকরা আমাদের সমস্ত কাজের কেন্দ্রে আছে। আমরা অসাধারণ পরিষেবা প্রদান এবং দ্রুত কোনো উদ্বেগ সমাধান করতে প্রতিশ্রুতিবদ্ধ।',
      ourTeam: 'আমাদের দল',
      teamText: 'আমাদের উৎসর্গীকৃত দল আপনি যাতে সম্ভাব্য সেরা সেবা পান তা নিশ্চিত করতে অক্লান্ত পরিশ্রম করে। আমাদের ডেলিভারি কর্মী থেকে শুরু করে আমাদের গ্রাহক সেবা প্রতিনিধি, পানি লাগবের প্রত্যেকেই আপনার সন্তুষ্টির জন্য প্রতিশ্রুতিবদ্ধ।'
    }
  };

  return (
    <div className={styles.about}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1>{text[language].title}</h1>
          <p>{text[language].subtitle}</p>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2>{text[language].ourStory}</h2>
          <p>{text[language].storyText}</p>
          <p>{text[language].storyText2}</p>
        </section>

        <div className={styles.missionVision}>
          <div className={styles.missionBox}>
            <h2>{text[language].ourMission}</h2>
            <p>{text[language].missionText}</p>
          </div>
          <div className={styles.visionBox}>
            <h2>{text[language].ourVision}</h2>
            <p>{text[language].visionText}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.ourValues}>{text[language].ourValues}</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>{text[language].value1Title}</h3>
              <p>{text[language].value1Text}</p>
            </div>
            <div className={styles.valueCard}>
              <h3>{text[language].value2Title}</h3>
              <p>{text[language].value2Text}</p>
            </div>
            <div className={styles.valueCard}>
              <h3>{text[language].value3Title}</h3>
              <p>{text[language].value3Text}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{text[language].ourTeam}</h2>
          <p>{text[language].teamText}</p>
        </section>
      </div>
    </div>
  );
};

export default About; 