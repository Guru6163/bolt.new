"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex border-b border-gray-200 bg-white relative">
      <motion.button
        onClick={() => onTabChange('code')}
        className={`px-4 py-2 text-sm font-medium relative z-10 transition-colors ${
          activeTab === 'code'
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: activeTab === 'code' ? [0, -5, 5, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </motion.svg>
          Code
        </div>
      </motion.button>
      <motion.button
        onClick={() => onTabChange('preview')}
        className={`px-4 py-2 text-sm font-medium relative z-10 transition-colors ${
          activeTab === 'preview'
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ scale: activeTab === 'preview' ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </motion.svg>
          Preview
        </div>
      </motion.button>
    </div>
  );
}
