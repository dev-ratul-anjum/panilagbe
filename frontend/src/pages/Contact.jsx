import { useState } from 'react';
import styles from './Contact.module.css';

const Contact = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Multilingual text
  const text = {
    en: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you',
      info: 'Contact Information',
      address: 'Address',
      addressValue: 'Dhaka Uddan, Mohammadpur, Dhaka, Bangladesh',
      phone: 'Phone',
      phoneValue: '+880 1315-380067',
      email: 'Email',
      emailValue: 'info@panilagbe.com',
      hours: 'Business Hours',
      hoursValue: 'Monday to Saturday: 8:00 AM - 8:00 PM',
      form: 'Send us a message',
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your name',
      emailLabel: 'Your Email',
      emailPlaceholder: 'Enter your email',
      phoneLabel: 'Your Phone',
      phonePlaceholder: 'Enter your phone number',
      messageLabel: 'Message',
      messagePlaceholder: 'How can we help you?',
      submit: 'Send Message',
      successTitle: 'Thank you!',
      successMessage: 'Your message has been sent. We will get back to you soon.'
    },
    bn: {
      title: 'যোগাযোগ করুন',
      subtitle: 'আমরা আপনার কথা শুনতে চাই',
      info: 'যোগাযোগের তথ্য',
      address: 'ঠিকানা',
      addressValue: 'ঢাকা উদ্যান, মোহাম্মদপুর, ঢাকা, বাংলাদেশ',
      phone: 'ফোন',
      phoneValue: '+৮৮০ ১৩১৫-৩৮০০৬৭',
      email: 'ইমেইল',
      emailValue: 'info@panilagbe.com',
      hours: 'ব্যবসার সময়',
      hoursValue: 'সোমবার থেকে শনিবার: সকাল ৮:০০ - রাত ৮:০০',
      form: 'আমাদের একটি বার্তা পাঠান',
      nameLabel: 'আপনার নাম',
      namePlaceholder: 'আপনার নাম লিখুন',
      emailLabel: 'আপনার ইমেইল',
      emailPlaceholder: 'আপনার ইমেইল লিখুন',
      phoneLabel: 'আপনার ফোন',
      phonePlaceholder: 'আপনার ফোন নম্বর লিখুন',
      messageLabel: 'বার্তা',
      messagePlaceholder: 'আমরা কিভাবে আপনাকে সাহায্য করতে পারি?',
      submit: 'বার্তা পাঠান',
      successTitle: 'ধন্যবাদ!',
      successMessage: 'আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show success message
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  
  return (
    <div className={styles.contact}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1>{text[language].title}</h1>
          <p>{text[language].subtitle}</p>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2>{text[language].info}</h2>
            
            <div className={styles.infoItem}>
              <h3>{text[language].address}</h3>
              <p>{text[language].addressValue}</p>
            </div>
            
            <div className={styles.infoItem}>
              <h3>{text[language].phone}</h3>
              <p>{text[language].phoneValue}</p>
            </div>
            
            <div className={styles.infoItem}>
              <h3>{text[language].email}</h3>
              <p>{text[language].emailValue}</p>
            </div>
            
            <div className={styles.infoItem}>
              <h3>{text[language].hours}</h3>
              <p>{text[language].hoursValue}</p>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <h2>{text[language].form}</h2>
            
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <h3>{text[language].successTitle}</h3>
                <p>{text[language].successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">{text[language].nameLabel}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={text[language].namePlaceholder}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">{text[language].emailLabel}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={text[language].emailPlaceholder}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">{text[language].phoneLabel}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={text[language].phonePlaceholder}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">{text[language].messageLabel}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={text[language].messagePlaceholder}
                    rows="5"
                  ></textarea>
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  {text[language].submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.mapContainer}>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1825.7433349032508!2d90.34130145201348!3d23.76567818070072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1002af91b4d%3A0x216c3c51298b9115!2sDhaka%20Uddan%20C%20brock%207%20no%20road!5e0!3m2!1sen!2sbd!4v1743655911220!5m2!1sen!2sbd" 
        width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Dhaka Map"></iframe>
      </div>
    </div>
  );
};

export default Contact; 