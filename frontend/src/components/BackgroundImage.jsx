import React, { useState, useEffect } from 'react';
import './BackgroundImage.css'; // CSS file link

const BackgroundImage = ({ src, placeholder, className = '', children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <div
      className={`background-image ${className} ${loaded ? 'loaded' : ''}`}
      style={{
        backgroundImage: `url(${loaded ? src : placeholder})`,
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundImage;
