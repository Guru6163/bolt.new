"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SiriOrb from "@/components/smoothui/ui/SiriOrb";
import { ThinkingStep as ThinkingStepComponent } from "@/components/ThinkingIndicators";

interface ThinkingStepData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'thinking' | 'completed';
  duration?: number;
}

export default function ThinkingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || '';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStepData[]>([
    {
      id: 'analyze',
      title: 'Analyzing Requirements',
      description: 'Understanding the project scope and technical requirements',
      status: 'thinking',
      duration: 2000
    },
    {
      id: 'plan',
      title: 'Planning Architecture',
      description: 'Designing the overall structure and component hierarchy',
      status: 'pending',
      duration: 3000
    },
    {
      id: 'optimize',
      title: 'Optimizing Approach',
      description: 'Refining the implementation strategy for best results',
      status: 'pending',
      duration: 2000
    },
    {
      id: 'prepare',
      title: 'Preparing Implementation',
      description: 'Setting up the development environment and dependencies',
      status: 'pending',
      duration: 1500
    }
  ]);

  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!prompt) {
      router.push('/');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    const processSteps = async () => {
      const initialSteps = [
        {
          id: 'analyze',
          title: 'Analyzing Requirements',
          description: 'Understanding the project scope and technical requirements',
          status: 'pending' as const,
          duration: 2000
        },
        {
          id: 'plan',
          title: 'Planning Architecture',
          description: 'Designing the overall structure and component hierarchy',
          status: 'pending' as const,
          duration: 3000
        },
        {
          id: 'optimize',
          title: 'Optimizing Approach',
          description: 'Refining the implementation strategy for best results',
          status: 'pending' as const,
          duration: 2000
        },
        {
          id: 'prepare',
          title: 'Preparing Implementation',
          description: 'Setting up the development environment and dependencies',
          status: 'pending' as const,
          duration: 1500
        }
      ];

      for (let i = 0; i < initialSteps.length; i++) {
        // Update current step to thinking
        setThinkingSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'thinking' as const }
            : step
        ));
        
        setCurrentStep(i);
        
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, initialSteps[i].duration || 2000));
        
        // Mark as completed
        setThinkingSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'completed' as const }
            : step
        ));
      }
      
      // All steps completed
      setIsComplete(true);
      
      // Navigate to builder after a short delay
      setTimeout(() => {
        router.push(`/builder?prompt=${encodeURIComponent(prompt)}`);
      }, 1500);
    };

    processSteps();
  }, [prompt, router, isProcessing]);


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Beams */}
      <BackgroundBeams className="absolute inset-0" />

      {/* Background SiriOrb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <SiriOrb
          size="600px"
          className="opacity-30"
          colors={{
            bg: "oklch(95% 0.02 264.695)",
            c1: "oklch(75% 0.15 350)",
            c2: "oklch(80% 0.12 200)",
            c3: "oklch(78% 0.14 280)",
          }}
          animationDuration={25}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-xs font-bold text-white">b</span>
            </motion.div>
            AI is thinking...
          </motion.div>

          <motion.h1 
            className="font-poppins mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="text-blue-600">Planning</span> your project
          </motion.h1>
          <motion.p 
            className="font-poppins mx-auto max-w-2xl text-xl font-medium text-slate-600 md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Our AI is analyzing your requirements and preparing the perfect solution
          </motion.p>
        </motion.div>

        {/* Thinking Steps */}
        <motion.div 
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="space-y-6">
            {thinkingSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <ThinkingStepComponent
                  title={step.title}
                  description={step.description}
                  status={step.status === 'thinking' ? 'thinking' : step.status === 'completed' ? 'completed' : 'pending'}
                  isActive={index === currentStep}
                  thinkingVariant="dots"
                />
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <motion.span
                key={`progress-label-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Progress
              </motion.span>
              <motion.span
                key={`progress-${currentStep}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {Math.round(((currentStep + (thinkingSteps[currentStep]?.status === 'completed' ? 1 : 0)) / thinkingSteps.length) * 100)}%
              </motion.span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentStep + (thinkingSteps[currentStep]?.status === 'completed' ? 1 : 0)) / thinkingSteps.length) * 100}%` 
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-30"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Completion Message */}
          <AnimatePresence>
            {isComplete && (
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 rounded-full bg-green-100 px-6 py-3 text-green-800 font-medium"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.4)',
                      '0 0 0 10px rgba(34, 197, 94, 0)',
                      '0 0 0 0 rgba(34, 197, 94, 0)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                  Ready to build! Redirecting...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
