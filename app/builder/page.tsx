"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { StepsList } from '@/components/StepsList';
import { FileExplorer } from '@/components/FileExplorer';
import { TabView } from '@/components/TabView';
import { CodeEditor } from '@/components/CodeEditor';
import { PreviewFrame } from '@/components/PreviewFrame';
import { ErrorDialog } from '@/components/ErrorDialog';
import { Step, FileItem, StepType } from '@/lib/types';
import { useWebContainer } from '@/lib/hooks/useWebContainer';
import { parseXml } from '@/lib/steps';
import { BACKEND_URL } from '@/lib/config';
import axios from 'axios';
import { FileSystemTree } from '@webcontainer/api';

export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || '';
  
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [projectReady, setProjectReady] = useState(false);
  
  const { webcontainer, isLoading: webcontainerLoading, error: webcontainerError } = useWebContainer(projectReady);

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setShowErrorDialog(true);
    setLoading(false);
  }, []);

  const getErrorMessage = (error: unknown): string => {
    const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
    return errorObj.response?.data?.message || errorObj.message || "An unexpected error occurred";
  };

  useEffect(() => {
    console.log('Steps effect triggered, steps:', steps);
    console.log('Current files:', files);
    
    let originalFiles = [...files];
    let updateHappened = false;
    const pendingSteps = steps.filter(({status}) => status === "pending");
    console.log('Pending steps:', pendingSteps);
    
    pendingSteps.map(step => {
      updateHappened = true;
      console.log('Processing step:', step);
      if (step?.type === StepType.CreateFile) {
        console.log('Creating file from step:', step);
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        console.log('Parsed path:', parsedPath);
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {
      console.log('Files updated, new files:', originalFiles);
      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
      }))
      
      // Auto-select the first file and switch to preview tab once files are created
      if (originalFiles.length > 0 && !selectedFile) {
        const firstFile = originalFiles.find(file => file.type === 'file');
        if (firstFile) {
          setSelectedFile(firstFile);
        }
        
        // Switch to preview tab if project is ready and files are created
        if (projectReady) {
          setTimeout(() => {
            setActiveTab('preview');
          }, 1000);
        }
      }
    }
    console.log(files);
  }, [steps, selectedFile, projectReady]);

  // Switch to preview tab when project is ready and files exist
  useEffect(() => {
    if (projectReady && files.length > 0 && activeTab === 'code') {
      setTimeout(() => {
        setActiveTab('preview');
      }, 1500); // Give a bit more time for files to mount
    }
  }, [projectReady, files.length, activeTab]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): FileSystemTree => {
      const mountStructure: FileSystemTree = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    // Only mount if we have files, project is ready, and WebContainer is available
    if (files.length === 0 || !projectReady || !webcontainer) {
      return;
    }

    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log('Files to mount:', files);
    console.log('Mount structure:', JSON.stringify(mountStructure, null, 2));
    
    console.log('Mounting to WebContainer...');
    webcontainer.mount(mountStructure);
  }, [files, webcontainer, projectReady]);

  const init = useCallback(async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
      });
      
      // Check if response contains an error
      if (response.data.error) {
        handleError(response.data.message);
        return;
      }
      
      setTemplateSet(true);
      
      const {prompts, uiPrompts} = response.data;

      console.log('Template response:', response.data);
      console.log('UI Prompts:', uiPrompts);

      // Don't parse uiPrompts as XML - they're just base prompts
      // The actual XML will come from the chat response
      setSteps([]);

      setLoading(true);
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      });

      // Check if response contains an error
      if (stepsResponse.data.error) {
        handleError(stepsResponse.data.message);
        return;
      }

      setLoading(false);

      console.log('Chat response:', stepsResponse.data);
      console.log('Raw response content:', stepsResponse.data.response);
      console.log('Parsed chat steps:', parseXml(stepsResponse.data.response, steps.length + 1));

      const newSteps = parseXml(stepsResponse.data.response, steps.length + 1);
      setSteps(s => [...s, ...newSteps.map(x => ({
        ...x,
        status: "pending" as const
      }))]);

      setLlmMessages([...prompts, prompt].map(content => ({
        role: "user",
        content
      })));

      setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
      
      // Mark project as ready for preview
      setProjectReady(true);
    } catch (error: unknown) {
      console.error("Error in init:", error);
      const errorMessage = getErrorMessage(error);
      handleError(errorMessage);
    }
  }, [prompt, handleError]);

  useEffect(() => {
    if (prompt) {
      init();
    } else {
      router.push('/');
    }
  }, [prompt, init, router]);

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        role: "user" as const,
        content: userPrompt
      };

      setLoading(true);
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...llmMessages, newMessage]
      });
      
      // Check if response contains an error
      if (stepsResponse.data.error) {
        handleError(stepsResponse.data.message);
        return;
      }
      
      setLoading(false);

      setLlmMessages(x => [...x, newMessage]);
      setLlmMessages(x => [...x, {
        role: "assistant",
        content: stepsResponse.data.response
      }]);
      
      const newSteps = parseXml(stepsResponse.data.response, steps.length + 1);
      setSteps(s => [...s, ...newSteps.map(x => ({
        ...x,
        status: "pending" as const
      }))]);

      setPrompt("");
    } catch (error: unknown) {
      console.error("Error in chat request:", error);
      const errorMessage = getErrorMessage(error);
      handleError(errorMessage);
    }
  };

  // Filter messages to show only conversational content, not code/requirements
  const filteredMessages = llmMessages.filter(message => {
    if (message.role === 'user') return true;
    
    // Filter out messages that contain code-like content or numbered requirements
    const content = message.content.toLowerCase();
    const hasCodeIndicators = content.includes('```') || 
                             content.includes('1.') && content.includes('2.') ||
                             content.includes('requirements') ||
                             content.includes('use ') && content.includes('react') ||
                             content.includes('typescript') ||
                             content.includes('tailwind') ||
                             content.includes('jsx');
    
    return !hasCodeIndicators;
  });

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Bolt.new</h1>
              <p className="text-xs text-gray-500 truncate max-w-xs">{prompt}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <motion.button 
                onClick={() => {/* Focus on steps section */}}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Steps
              </motion.button>
              <motion.button 
                onClick={() => {/* Focus on chat section */}}
                className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-md"
                whileHover={{ scale: 1.05, backgroundColor: 'rgb(243 232 255)' }}
                whileTap={{ scale: 0.95 }}
              >
                Chat
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <motion.button 
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'code' 
                    ? 'text-purple-600 bg-purple-50 rounded-md' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                &lt;/&gt; Code
              </motion.button>
              <motion.button 
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'preview' 
                    ? 'text-purple-600 bg-purple-50 rounded-md' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preview
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Steps/Files */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        {/* Steps Section */}
        <div className="h-1/2 border-b border-gray-200">
          <StepsList
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            loading={loading || !templateSet}
          />
        </div>
        
        {/* File Explorer Section */}
        <div className="h-1/2">
          <FileExplorer 
            files={files} 
            onFileSelect={setSelectedFile}
          />
        </div>
      </div>

      {/* Middle Section - Chat */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
        {/* Chat Header */}
        <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Chat</h1>
              <p className="text-xs text-gray-500 truncate max-w-xs">{prompt}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {loading && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="size-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="size-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    />
                    <motion.div 
                      className="size-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <AnimatePresence>
          {!(loading || !templateSet) && (
            <motion.div 
              className="shrink-0 border-t border-gray-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-2">
                <motion.input 
                  type="text"
                  value={userPrompt} 
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask for changes..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button 
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgb(126 34 206)',
                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Send
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/* Right Section - Viewer */}
        <div className="flex-1 flex flex-col bg-white">
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 min-h-0 relative">
            {/* Code Editor - stays mounted but hidden */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ 
                opacity: activeTab === 'code' ? 1 : 0,
                pointerEvents: activeTab === 'code' ? 'auto' : 'none'
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CodeEditor file={selectedFile} loading={loading || !templateSet} />
            </motion.div>
            
            {/* Preview Frame - stays mounted but hidden */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ 
                opacity: activeTab === 'preview' ? 1 : 0,
                pointerEvents: activeTab === 'preview' ? 'auto' : 'none'
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <PreviewFrame 
                webContainer={webcontainer ?? undefined} 
                files={files} 
                isLoading={webcontainerLoading}
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Error Dialog */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        error={error || ""}
      />
    </div>
  );
}
