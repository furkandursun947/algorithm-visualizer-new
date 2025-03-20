import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaMemory, FaArrowRight } from 'react-icons/fa';

const AlgorithmCard = ({ algorithm, categoryId }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      layout
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {algorithm.name}
        </h3>
        <p className="text-gray-600 mb-4">
          {algorithm.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <FaClock className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">Time Complexity</p>
              <div className="text-xs text-gray-500">
                <span className="mr-2">Best: {algorithm.timeComplexity?.best}</span>
                <span className="mr-2">Average: {algorithm.timeComplexity?.average}</span>
                <span>Worst: {algorithm.timeComplexity?.worst}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaMemory className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">Space Complexity</p>
              <p className="text-xs text-gray-500">{algorithm.spaceComplexity}</p>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/algorithms/${categoryId}/${algorithm.id}`}
          className="flex items-center justify-between w-full py-2 px-4 bg-blue-50 rounded-md text-blue-700 font-medium hover:bg-blue-100 transition-colors"
        >
          <span>View Details</span>
          <FaArrowRight />
        </Link>
      </div>
    </motion.div>
  );
};

export default AlgorithmCard; 