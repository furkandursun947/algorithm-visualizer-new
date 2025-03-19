import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { useLenis } from '../../context/LenisContext';

const Hero = () => {
  const lenis = useLenis();

  const handleScrollDown = () => {
    if (lenis) {
      // Scroll to the Features section smoothly
      const featuresSection = document.querySelector('#features-section');
      if (featuresSection) {
        lenis.scrollTo(featuresSection, {
          offset: -50, // Offset to account for any fixed headers
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Visualize & Understand 
            <span className="text-blue-400"> Algorithms</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Interactive visualizations to help you understand how algorithms work.
            Learn sorting, searching, graph algorithms and more through step-by-step animations.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/algorithms" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
            >
              Explore Algorithms
              <FaArrowRight className="ml-2" />
            </Link>
            
            <button
              onClick={handleScrollDown}
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 transition duration-300"
            >
              Learn More
              <FaChevronDown className="ml-2 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <button
          onClick={handleScrollDown}
          className="text-white hover:text-blue-400 transition-colors duration-300"
          aria-label="Scroll down"
        >
          <FaChevronDown className="animate-bounce" size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default Hero; 