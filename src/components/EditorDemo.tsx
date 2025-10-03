import React from 'react';
import PresenceBar from './PresenceBar';
import EmailMetadata from './EmailMetadata';
import EditorToolbar from './EditorToolbar';
import CollaborativeEditor from './CollaborativeEditor';
import CommentThread from './CommentThread';

export default function EditorDemo() {
  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-gray-600">
            Experience real-time collaboration with live cursors and instant updates
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <PresenceBar />
          <EmailMetadata />
          <EditorToolbar />
          <div className="p-6">
            <CommentThread />
          </div>
          <CollaborativeEditor />
        </div>
      </div>
    </div>
  );
}
