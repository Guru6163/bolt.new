"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { FileItem } from '@/lib/types';

interface CodeEditorProps {
  file: FileItem | null;
  loading?: boolean;
}

export function CodeEditor({ file, loading = false }: CodeEditorProps) {
  if (!file) {
    return (
      <motion.div 
        className="h-full flex flex-col items-center justify-center text-gray-400 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-center"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto"
            animate={loading ? { 
              scale: [1, 1.05, 1],
              rotate: [0, 360]
            } : {}}
            transition={loading ? { 
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" }
            } : {}}
          >
            {loading ? (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </motion.div>
          <motion.h3 
            className="text-lg font-medium text-gray-600 mb-2"
            animate={loading ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={loading ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
          >
            {loading ? 'Generating Project...' : 'No file selected'}
          </motion.h3>
          <p className="text-sm text-gray-500">
            {loading ? 'Creating your project files...' : 'Choose a file from the explorer to view its contents'}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="h-full bg-white"
      key={file.path}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-light"
        value={file.content || ''}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'gutter',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </motion.div>
  );
}
