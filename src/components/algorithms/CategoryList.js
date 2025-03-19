import React from 'react';
import { motion } from 'framer-motion';

const CategoryList = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 sticky top-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <motion.li 
            key={category.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                activeCategory === category.id 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
              <span className="text-xs ml-2 text-gray-500">
                ({category.algorithms.length})
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList; 