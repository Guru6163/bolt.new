"use client";

import React, { useState } from 'react';
import { FileItem } from '@/lib/types';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFile = (file: FileItem, level = 0) => {
    const isFolder = file.type === 'folder';
    const isExpanded = expandedFolders.has(file.path);
    const paddingLeft = level * 16;
    
    return (
      <div key={file.path} className="select-none">
        <div
          className="flex items-center py-1.5 px-2 hover:bg-gray-100 cursor-pointer transition-colors"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(file.path);
            } else {
              onFileSelect(file);
            }
          }}
        >
          <div className="flex items-center flex-1 min-w-0 gap-1.5">
            {isFolder ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
                <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </>
            ) : (
              <>
                <div className="w-4" /> {/* Spacer for alignment */}
                <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </>
            )}
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
          </div>
        </div>
        {isFolder && file.children && isExpanded && (
          <div>
            {file.children.map(child => renderFile(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 border-t border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-700">Files</h3>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No files yet</p>
          </div>
        ) : (
          <div className="p-2">
            {files.map(file => renderFile(file))}
          </div>
        )}
      </div>
    </div>
  );
}
