import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Analytics } from "@vercel/analytics/react"
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Analytics />
    </div>
  );
};

export default Layout; 