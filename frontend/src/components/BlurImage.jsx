import { useState, useEffect } from 'react';
import './BlurImage.css';

const BlurImage = ({ src, placeholder, alt, className = '', ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`blur-image ${loaded ? 'loaded' : ''} ${className}`}
      {...props}
    />
  );
};

export default BlurImage;
