import React from 'react';
import { motion } from 'motion/react';
import { Percent, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { setCurrentPage, setSelectedCategory } = useShop();

  const handleShopNowClick = () => {
    setSelectedCategory('All');
    setCurrentPage('home');
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-64 bg-indigo-600 rounded-[2rem] overflow-hidden mb-10 shadow-xl border border-indigo-700 shrink-0" id="hero-banner-root">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-990/40 via-indigo-900/20 to-transparent"></div>
      
      <div className="relative h-full flex flex-col justify-center px-8 sm:px-16 text-white z-10 max-w-2xl">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-indigo-100 font-extrabold tracking-widest text-[10px] uppercase mb-2 block"
          id="hero-tagline-container"
        >
          Limited Time Offer • Season Specials
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight font-sans text-white"
          id="hero-main-title"
        >
          Upgrade Your Tech<br />& Modern Experience.
        </motion.h1>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleShopNowClick}
          className="bg-white text-indigo-600 font-black px-8 py-3 rounded-2xl w-fit shadow-lg shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
          id="btn-hero-cta"
        >
          Shop Now
        </motion.button>
      </div>

      {/* Hexagonal Geometry Vector */}
      <div className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden sm:block">
        <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.16.09-.34.14-.5.14s-.34-.05-.5-.14l-7.97-4.44c-.31-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.16-.09.34-.14.5-.14s.34.05.5.14l7.97 4.44c.32.17.53.5.53.88v9z"></path>
        </svg>
      </div>
    </div>
  );
};
