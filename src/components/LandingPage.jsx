// Inside src/components/LandingPage.jsx
import React, { useState, useEffect } from 'react';

const ORANGE = '#FF5722'; 
const LIGHT_BG = '#F5F5F5';

const LandingPage = ({ setPage }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleGetStarted = () => {
    setPage('products');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    // Fallback if image fails to load
    e.target.style.display = 'none';
  };

  return (
    <div className="landing-page-container flex flex-col items-center justify-center w-full h-full p-6 sm:p-10 relative" style={{ backgroundColor: LIGHT_BG }}>
      
      {/* Online/Offline Status Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-md">
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className="text-xs font-semibold text-gray-700">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Animation Section */}
      <div className="relative w-full max-w-lg mb-10 sm:mb-16 flex justify-center items-center">
        {/* The motor.png image from the public folder */}
        <img
          src="/motor.png"
          alt="Delivery Motor"
          className={`w-48 sm:w-64 motor-moving-animation transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-50'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* Text/Bubble to add a creative touch */}
        <div className="absolute top-0 right-0 sm:right-10 p-2 sm:p-3 bg-white rounded-full shadow-lg transform rotate-6">
            <span className="text-xl sm:text-2xl" role="img" aria-label="Fast Delivery">💨</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="text-center max-w-xl">
        <h1 
          className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in" 
          style={{ color: ORANGE }}
        >
          Your Food, Fast!
        </h1>
        <p className="text-md sm:text-lg text-gray-700 mb-8 sm:mb-10 animate-slide-up">
          The fastest and easiest way to discover the best local flavors in Iligan City and get them delivered to your door.
        </p>
        
        {/* Offline Mode Notice */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
            <p className="text-yellow-800 font-semibold text-sm">
              ⚠️ You're offline - Content may be limited
            </p>
          </div>
        )}

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 sm:px-10 sm:py-4 text-white font-bold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 active:scale-95"
          style={{ backgroundColor: ORANGE, borderColor: ORANGE }}
        >
          <span className="text-lg sm:text-xl">
            {isOnline ? 'Get Started Now!' : 'Browse Offline'}
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 text-xs text-gray-500 text-center max-w-xs">
        <p>🍕 Iligan Food Hub - Your local food delivery partner</p>
      </div>
      
    </div>
  );
};

export default LandingPage;