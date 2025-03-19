import React from 'react';
import { motion } from 'framer-motion';
import ArrayBar from './common/ArrayBar';

const SortingVisualization = ({ 
  data, 
  step, 
  stepInfo 
}) => {
  const { 
    array = [], 
    activeIndices = [], 
    comparingIndices = [], 
    sortedIndices = [] 
  } = data || {};
  
  // Find the maximum value in the array for scaling
  const maxValue = Math.max(...array);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end justify-center space-x-1 sm:space-x-2">
        {array.map((value, index) => (
          <ArrayBar
            key={`${index}-${value}-${step}`}
            value={value}
            maxValue={maxValue}
            index={index}
            isActive={activeIndices.includes(index)}
            isComparing={comparingIndices.includes(index)}
            isSorted={sortedIndices.includes(index)}
          />
        ))}
      </div>
      
      {stepInfo.arrayState && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-gray-100 rounded-md text-xs sm:text-sm"
        >
          <p className="font-mono text-gray-700">
            {stepInfo.arrayState}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SortingVisualization; 