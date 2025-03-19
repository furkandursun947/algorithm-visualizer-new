import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import CategoriesPreview from '../components/landing/CategoriesPreview';

const Home = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Hero />
        <Features />
        <CategoriesPreview />
      </motion.div>
    </Layout>
  );
};

export default Home; 