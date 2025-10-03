import React, { useState, useEffect, useRef } from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CollaborativeEditor() {
  const { currentDocument, updateDocument, presence, updatePresence } = useDocument();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (currentDocument) {
      setContent(currentDocument.content || '');
    }
  }, [currentDocument?.id]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce database update
    updateTimeoutRef.current = setTimeout(() => {
      updateDocument({ content: newContent });
    }, 500);

    // Update cursor position immediately
    if (textareaRef.current) {
      updatePresence(textareaRef.current.selectionStart);
    }
  };

  const handleCursorMove = () => {
    if (textareaRef.current) {
      updatePresence(textareaRef.current.selectionStart);
    }
  };

  return (
    <div className="relative bg-white min-h-[500px] px-6 py-4">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onKeyUp={handleCursorMove}
        onClick={handleCursorMove}
        placeholder="Start typing your email... Your team can see changes in real-time."
        className="w-full min-h-[450px] text-gray-800 text-base leading-relaxed focus:outline-none resize-none font-serif"
        style={{ fontFamily: 'Georgia, serif' }}
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
