import { useEffect } from 'react';
import { useLenis } from '../context/LenisContext';

// Custom hook for scroll-triggered animations with Lenis
const useScrollAnimation = (callback) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Add scroll listener to Lenis
    const onScroll = ({ scroll, limit, velocity, direction, progress }) => {
      // Call the callback with scroll data
      if (callback && typeof callback === 'function') {
        callback({ scroll, limit, velocity, direction, progress });
      }
    };

    // Subscribe to scroll event
    lenis.on('scroll', onScroll);

    // Cleanup function
    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis, callback]);

  return lenis;
};

export default useScrollAnimation; 