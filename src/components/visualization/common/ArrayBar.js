import React from 'react';
import { motion } from 'framer-motion';

const ArrayBar = ({ 
  value, 
  maxValue, 
  index, 
  isActive = false, 
  isComparing = false, 
  isSorted = false,
  label = null
}) => {
  // Calculate height as a percentage of maxValue
  const heightPercentage = (value / maxValue) * 100;
  
  // Determine color based on bar state
  let barColor = 'bg-blue-500';
  
  if (isActive) {
    barColor = 'bg-green-500';
  } else if (isComparing) {
    barColor = 'bg-yellow-500';
  } else if (isSorted) {
    barColor = 'bg-purple-500';
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        initial={{ height: 0 }}
        animate={{ 
          height: `${heightPercentage}%`,
          backgroundColor: isActive ? '#10B981' : isComparing ? '#F59E0B' : isSorted ? '#8B5CF6' : '#3B82F6'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`w-8 rounded-t-md ${barColor}`}
        style={{ minHeight: '5px' }}
      />
      <div className="mt-1 text-xs text-gray-600">
        {label !== null ? label : value}
      </div>
    </div>
  );
};

export default ArrayBar; 