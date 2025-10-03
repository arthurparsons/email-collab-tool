import React from 'react';
import { Collaborator } from '../data/collaborators';

interface Props {
  collaborator: Collaborator;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export default function CollaboratorAvatar({ collaborator, size = 'md', showStatus = true }: Props) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className="relative inline-block">
      <img
        src={collaborator.avatar}
        alt={collaborator.name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2`}
        style={{ borderColor: collaborator.color }}
      />
      {showStatus && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            collaborator.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
}
