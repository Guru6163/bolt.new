"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThinkingIndicatorsProps {
  variant?: 'dots' | 'pulse' | 'wave' | 'typing';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'green' | 'gray';
  className?: string;
}

export function ThinkingIndicators({ 
  variant = 'dots', 
  size = 'md', 
  color = 'blue',
  className = '' 
}: ThinkingIndicatorsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    green: 'bg-green-400',
    gray: 'bg-gray-400'
  };

  const spacingClasses = {
    sm: 'space-x-1',
    md: 'space-x-1.5',
    lg: 'space-x-2'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex ${spacingClasses[size]} ${className}`}>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${className}`}>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
        ></div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`flex ${spacingClasses[size]} ${className}`}>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{ animationDelay: '200ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{ animationDelay: '400ms' }}
        ></div>
      </div>
    );
  }

  if (variant === 'typing') {
    return (
      <div className={`flex ${spacingClasses[size]} ${className}`}>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '100ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '200ms' }}
        ></div>
      </div>
    );
  }

  return null;
}

interface ThinkingStepProps {
  title: string;
  description: string;
  status: 'pending' | 'thinking' | 'completed';
  isActive?: boolean;
  thinkingVariant?: 'dots' | 'pulse' | 'wave' | 'typing';
  className?: string;
}

export function ThinkingStep({ 
  title, 
  description, 
  status, 
  isActive = false,
  thinkingVariant = 'dots',
  className = ''
}: ThinkingStepProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'thinking':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <ThinkingIndicators variant="pulse" size="sm" color="blue" />
          </div>
        );
      default:
        return (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isActive ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isActive ? 'bg-blue-500' : 'bg-gray-400'
            }`}></div>
          </div>
        );
    }
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl border-2 overflow-hidden ${className}`}
      animate={{
        borderColor: status === 'thinking'
          ? 'rgb(147 197 253)' // blue-300
          : status === 'completed'
          ? 'rgb(134 239 172)' // green-300
          : 'rgb(229 231 235)', // gray-200
        backgroundColor: status === 'thinking'
          ? 'rgb(239 246 255)' // blue-50
          : status === 'completed'
          ? 'rgb(240 253 244)' // green-50
          : 'rgb(255 255 255)', // white
        boxShadow: status === 'thinking'
          ? '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -4px rgba(59, 130, 246, 0.1)'
          : status === 'completed'
          ? '0 4px 6px -1px rgba(34, 197, 94, 0.05)'
          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          key={status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {getStatusIcon()}
        </motion.div>
        <div className="flex-1">
          <motion.h3 
            className={`text-lg font-semibold mb-2`}
            animate={{
              color: status === 'thinking' ? 'rgb(30 58 138)' : // blue-900
                     status === 'completed' ? 'rgb(20 83 45)' : // green-900
                     'rgb(55 65 81)' // gray-700
            }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className={`text-sm`}
            animate={{
              color: status === 'thinking' ? 'rgb(29 78 216)' : // blue-700
                     status === 'completed' ? 'rgb(21 128 61)' : // green-700
                     'rgb(107 114 128)' // gray-500
            }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>
          <AnimatePresence>
            {status === 'thinking' && (
              <motion.div 
                className="mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ThinkingIndicators variant={thinkingVariant} size="sm" color="blue" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
