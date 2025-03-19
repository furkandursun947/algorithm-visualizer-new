import React from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaCode, FaMobileAlt, FaLightbulb } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaChartBar size={36} />,
      title: 'Interactive Visualizations',
      description: 'Watch algorithms in action with step-by-step animations to understand how they work.'
    },
    {
      icon: <FaCode size={36} />,
      title: 'Algorithm Details',
      description: 'Learn about time complexity, space complexity, and pseudocode for each algorithm.'
    },
    {
      icon: <FaMobileAlt size={36} />,
      title: 'Responsive Design',
      description: 'Access from any device - desktop, tablet, or mobile - with a fully responsive design.'
    },
    {
      icon: <FaLightbulb size={36} />,
      title: 'Educational Tool',
      description: 'Perfect for students, educators, and developers to learn and teach algorithm concepts.'
    }
  ];

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
    <section id="features-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Powerful Features
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what makes our algorithm visualizer stand out.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-slate-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 