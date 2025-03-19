import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import algorithmData from '../../data/algorithms.json';

const CategoriesPreview = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Get the categories from the JSON data
    setCategories(algorithmData.categories);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Algorithm Categories
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Explore different categories of algorithms and learn how they work.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.slice(0, 3).map((category) => (
            <motion.div 
              key={category.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.algorithms.slice(0, 3).map(algo => (
                      <span 
                        key={algo.id} 
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {algo.name}
                      </span>
                    ))}
                    {category.algorithms.length > 3 && (
                      <span className="inline-block text-gray-500 text-xs px-2 py-1">
                        +{category.algorithms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <Link 
                    to={`/algorithms#${category.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Explore {category.name} →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {categories.length > 3 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/algorithms" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
            >
              View All Categories
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoriesPreview; 