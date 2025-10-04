import React, { useState, useEffect, useRef } from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from './RichTextEditor';

export default function CollaborativeEditor() {
  const { currentDocument, updateDocument, presence, updatePresence } = useDocument();
  const { user } = useAuth();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const handleContentChange = (htmlContent: string, jsonContent: any) => {
    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce database update
    updateTimeoutRef.current = setTimeout(() => {
      updateDocument({ 
        content: htmlContent, 
        content_delta: jsonContent 
      });
    }, 500);
  };

  const handleCursorChange = (position: number) => {
    updatePresence(position);
  };

  return (
    <div className="relative bg-white min-h-[500px] p-4">
      <RichTextEditor
        content={currentDocument?.content}
        contentDelta={currentDocument?.content_delta}
        onChange={handleContentChange}
        onCursorChange={handleCursorChange}
        placeholder="Start typing your email... Your team can see changes in real-time."
        className="mb-4"
      />
      
      {/* Live cursor indicators */}
      <div className="absolute top-6 right-6 space-y-2">
        {presence.slice(0, 3).map((p, index) => (
          <div
            key={p.user_id}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-lg border animate-pulse"
            style={{ 
              borderColor: p.color,
              animationDelay: `${index * 0.3}s`,
              animationDuration: '2s'
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs font-medium text-gray-700">{p.user_name} is typing...</span>
          </div>
        ))}
      </div>
    </div>
  );
}
