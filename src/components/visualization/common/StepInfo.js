import React from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';

const StepInfo = ({ 
  stepDescription, 
  codeHighlight = null,
  complexityInfo = null
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="flex items-start mb-3">
        <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
        <h3 className="text-lg font-medium text-gray-900">Step Information</h3>
      </div>
      
      <div className="mb-4">
        <motion.p 
          key={stepDescription} // Force animation when step changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700"
        >
          {stepDescription}
        </motion.p>
      </div>
      
      {codeHighlight && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Relevant Code:</h4>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
            <code className="text-gray-800">{codeHighlight}</code>
          </pre>
        </div>
      )}
      
      {complexityInfo && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Complexity at this step:</h4>
          <p className="text-gray-600 text-sm">{complexityInfo}</p>
        </div>
      )}
      
    </motion.div>
  );
};

export default StepInfo; 