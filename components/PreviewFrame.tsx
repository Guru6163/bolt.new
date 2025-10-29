"use client";

import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface FileItem {
  name: string;
  children?: FileItem[];
}

interface PreviewFrameProps {
  files: FileItem[];
  webContainer?: WebContainer;
  isLoading?: boolean;
}

export function PreviewFrame({ files, webContainer, isLoading = false }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function main() {
      if (!webContainer) {
        console.log('WebContainer not available');
        return;
      }

      console.log('Starting WebContainer setup...');
      setIsInitializing(true);

      try {
        console.log('Running npm install...');
        const installProcess = await webContainer.spawn("npm", ["install"]);
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              if (!cancelled) console.log('npm install:', data);
            },
          })
        );

        await installProcess.exit;

        console.log('Running npm run dev...');
        await webContainer.spawn("npm", ["run", "dev"]);

        webContainer.on("server-ready", (_port, serverUrl) => {
          if (!cancelled) {
            console.log('Server ready at:', serverUrl);
            setUrl(serverUrl);
            setIsInitializing(false);
          }
        });

        // Also check if server is already running
        const serverUrl = webContainer.url;
        if (serverUrl) {
          console.log('Server already running at:', serverUrl);
          setUrl(serverUrl);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Error in WebContainer setup:', error);
        setIsInitializing(false);
      }
    }

    main();

    return () => {
      cancelled = true;
    };
  }, [webContainer]);

  return (
    <div className="h-full bg-white">
      {isLoading ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Initializing WebContainer</h3>
            <p className="text-sm text-gray-500">Setting up the development environment...</p>
          </div>
        </div>
      ) : !webContainer ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Waiting for Backend Response</h3>
            <p className="text-sm text-gray-500">WebContainer will be initialized after receiving the project structure from the backend.</p>
          </div>
        </div>
      ) : !url ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Starting Preview</h3>
            <p className="text-sm text-gray-500">Installing dependencies and starting the development server...</p>
            <p className="text-xs text-gray-400 mt-2">Debug: URL = {url || 'null'}</p>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="text-xs text-gray-400 p-2 bg-gray-50 flex-shrink-0">Debug: Loading {url}</div>
          <iframe 
            width="100%" 
            height="100%"
            src={url}
            className="border-0 flex-1"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            style={{ minHeight: '0' }}
          />
        </div>
      )}
    </div>
  );
}
