import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Service from './pages/Service';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Reviews from './pages/Reviews';
import NotFound from './pages/NotFound';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFail from './pages/CheckoutFail';
import CheckoutCancel from './pages/CheckoutCancel';
import './App.css';
import useAuth from './hooks/useAuth';

function App() {
  const [language, setLanguage] = useState('bn'); // Default language - Bengali
  const {user, setUser} = useAuth();

  const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  };

  // Check for saved user info on app load
  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('panilagbe-user', JSON.stringify(userData));
  };
  
  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('panilagbe-token');

    window.location.href = '/';
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header 
          language={language} 
          onLanguageChange={handleLanguageChange}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/about" element={<About language={language} />} />
            <Route path="/service" element={<Service  language={language} />} />
            <Route path="/contact" element={<Contact language={language} />} />
            <Route path="/reviews" element={<Reviews language={language} />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/profile" replace /> : <Login  language={language}  />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/profile" replace /> : <Register  language={language}/>} 
            />
            <Route 
              path="/profile" 
              element={
                user ? <Profile 
                  language={language} 
                  onUpdateUser={handleLogin}
                /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/payment" 
              element={
                user ? <Payment language={language} /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/checkout/success/:tranId" 
              element={<CheckoutSuccess language={language}  />} 
            />
            <Route 
              path="/checkout/fail/:tranId" 
              element={<CheckoutFail language={language}  />} 
            />
            <Route 
              path="/checkout/cancel/:tranId" 
              element={<CheckoutCancel language={language}  />} 
            />
            <Route path="*" element={<NotFound language={language} />} />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
