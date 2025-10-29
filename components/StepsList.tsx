"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step } from '@/lib/types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  loading?: boolean;
}

export function StepsList({ steps, currentStep, onStepClick, loading = false }: StepsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-700">Steps</h3>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="p-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mb-2 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
              <motion.p 
                className="text-sm text-gray-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Generating steps...
              </motion.p>
              
              {/* Skeleton Loading */}
              <div className="mt-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-gray-200 rounded-lg p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.4, 0.6, 0.4], y: 0 }}
                    transition={{
                      opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.2 },
                      y: { duration: 0.3 }
                    }}
                  >
                    <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded w-full"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : steps.length === 0 ? (
            <motion.div 
              className="p-4 text-center text-gray-500"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm">No steps yet</p>
            </motion.div>
          ) : (
            <motion.div 
              className="p-2 space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`p-2 rounded-lg cursor-pointer ${
                      currentStep === index + 1
                        ? 'bg-blue-100 border border-blue-200'
                        : ''
                    }`}
                    onClick={() => onStepClick(index + 1)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ 
                      backgroundColor: currentStep === index + 1 ? 'rgb(219 234 254)' : 'rgb(243 244 246)',
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-2">
                      <motion.div
                        key={`${step.id}-${step.status}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getStatusIcon(step.status)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
