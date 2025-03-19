import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import CategoryList from '../components/algorithms/CategoryList';
import AlgorithmCard from '../components/algorithms/AlgorithmCard';
import algorithmData from '../data/algorithms.json';

const Algorithms = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Get all algorithms from all categories
  const allAlgorithms = useMemo(() => {
    return categories.flatMap(category => 
      category.algorithms.map(algo => ({
        ...algo,
        categoryId: category.id,
        categoryName: category.name
      }))
    );
  }, [categories]);

  // Filter algorithms based on search query
  const filteredAlgorithms = useMemo(() => {
    if (!searchQuery.trim()) {
      // If no search query, return algorithms from active category
      const category = categories.find(cat => cat.id === activeCategory);
      // Add categoryId to each algorithm object
      return category ? category.algorithms.map(algo => ({
        ...algo,
        categoryId: category.id,
        categoryName: category.name
      })) : [];
    }

    // Search through all algorithms across categories
    const query = searchQuery.toLowerCase().trim();
    return allAlgorithms.filter(algo => 
      algo.name.toLowerCase().includes(query) || 
      algo.description.toLowerCase().includes(query)
    );
  }, [searchQuery, activeCategory, categories, allAlgorithms]);

  useEffect(() => {
    // Get the categories from the JSON data
    const allCategories = algorithmData.categories;
    setCategories(allCategories);
    
    // Set the first category as active by default
    if (allCategories.length > 0 && !activeCategory) {
      setActiveCategory(allCategories[0].id);
    }
  }, [activeCategory]);

  // Check if there's a hash in the URL to activate a specific category
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && categories.some(cat => cat.id === hash)) {
      setActiveCategory(hash);
    }
  }, [categories]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Escape key clears search
    if (e.key === 'Escape') {
      clearSearch();
    }
    
    // Ctrl+K or Cmd+K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  // Add global keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Layout>
      <motion.div 
        className="py-8 bg-slate-50 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Algorithm Explorer
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Browse all algorithms by category and learn how they work.
            </p>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div 
            className="mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`relative rounded-md shadow-sm transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Search algorithms"
                className="block w-full pl-10 pr-10 py-3 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search algorithms by name or description... (Ctrl+K)"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={(e) => e.key === 'Escape' && clearSearch()}
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <FaTimes 
                    className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                    onClick={clearSearch}
                    aria-label="Clear search"
                  />
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+K</kbd> to search &nbsp;•&nbsp; 
              <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to clear
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Only show categories sidebar when not searching */}
            {!searchQuery && (
              <div className="md:col-span-1">
                <CategoryList 
                  categories={categories} 
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
            )}
            
            <div className={`${searchQuery ? 'md:col-span-4' : 'md:col-span-3'}`}>
              <AnimatePresence mode="wait">
                {searchQuery ? (
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Search Results
                      </h2>
                      <p className="text-gray-600">
                        Found {filteredAlgorithms.length} {filteredAlgorithms.length === 1 ? 'algorithm' : 'algorithms'} matching "{searchQuery}"
                      </p>
                    </div>
                    
                    {filteredAlgorithms.length > 0 ? (
                      <div className="space-y-6">
                        {filteredAlgorithms.map(algorithm => (
                          <div key={algorithm.id}>
                            {searchQuery && (
                              <div className="mb-2 text-sm font-medium text-gray-500">
                                Category: {algorithm.categoryName}
                              </div>
                            )}
                            <AlgorithmCard 
                              key={algorithm.id} 
                              algorithm={algorithm} 
                              categoryId={algorithm.categoryId}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="bg-white rounded-lg shadow-md p-8 text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No algorithms found</h3>
                        <p className="text-gray-600 mb-4">Try a different search term or browse by category.</p>
                        <button
                          onClick={clearSearch}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Clear Search
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {categories.find(cat => cat.id === activeCategory)?.name}
                      </h2>
                      <p className="text-gray-600">
                        {categories.find(cat => cat.id === activeCategory)?.description}
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      {filteredAlgorithms.map(algorithm => (
                        <AlgorithmCard 
                          key={algorithm.id} 
                          algorithm={algorithm} 
                          categoryId={algorithm.categoryId}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Algorithms; 