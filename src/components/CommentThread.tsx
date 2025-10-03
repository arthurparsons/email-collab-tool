import React from 'react';
import CollaboratorAvatar from './CollaboratorAvatar';
import { collaborators } from '../data/collaborators';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const comments: Comment[] = [
  { id: '1', author: 'Sarah Chen', content: 'Can we make the CTA more prominent?', timestamp: '5m ago' },
  { id: '2', author: 'Marcus Johnson', content: 'Good point! I\'ll adjust the formatting.', timestamp: '3m ago' },
];

export default function CommentThread() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">Comments (2)</h4>
      <div className="space-y-3">
        {comments.map((comment) => {
          const author = collaborators.find(c => c.name === comment.author);
          return (
            <div key={comment.id} className="flex gap-3">
              {author && <CollaboratorAvatar collaborator={author} size="sm" showStatus={false} />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{comment.author}</span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <input type="text" placeholder="Add a comment..." className="w-full mt-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
    </div>
  );
}
