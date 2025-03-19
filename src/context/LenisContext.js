import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';

// Create the context
const LenisContext = createContext(null);

// Custom hook to use the Lenis context
export const useLenis = () => {
  const context = useContext(LenisContext);
  if (context === undefined) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
};

// Provider component
export const LenisProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);
  
  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Set up RAF loop
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Store Lenis instance in state
    setLenis(lenisInstance);
    
    // Cleanup function
    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider; 