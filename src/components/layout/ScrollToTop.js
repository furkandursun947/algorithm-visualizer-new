import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../../context/LenisContext';

// This component will scroll to the top of the page when the route changes
const ScrollToTop = () => {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // Scroll to top smoothly when the route changes
      lenis.scrollTo(0, { immediate: false, duration: 1 });
    }
  }, [location.pathname, lenis]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 