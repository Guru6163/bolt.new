"use client";

import React from 'react';
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
        {loading ? (
          <div className="p-4 text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Generating steps...</p>
          </div>
        ) : steps.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No steps yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  currentStep === index + 1
                    ? 'bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onStepClick(index + 1)}
              >
                <div className="flex items-start gap-2">
                  {getStatusIcon(step.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
