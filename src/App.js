import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import NotFound from './pages/NotFound';
import { LenisProvider } from './context/LenisContext';
import ScrollToTop from './components/layout/ScrollToTop';
import './App.css';

// Create a wrapper component to use the useLocation hook
const AnimatedRoutes = () => {
  const location = useLocation();
  console.log(location);
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/algorithms/:categoryId/:algorithmId" element={<AlgorithmDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <LenisProvider>
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </LenisProvider>
  );
}

export default App;
