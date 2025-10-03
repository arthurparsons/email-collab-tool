import React from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function PresenceBar() {
  const { presence } = useDocument();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Active now:</span>
          <div className="flex -space-x-2">
            {presence.map((p) => (
              <div
                key={p.user_id}
                className="hover:z-10 transition-transform hover:scale-110"
                title={p.user_name}
              >
                <Avatar className="w-8 h-8 border-2 border-white" style={{ borderColor: p.color }}>
                  <AvatarFallback style={{ backgroundColor: p.color, color: 'white' }}>
                    {getInitials(p.user_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {presence.length} online
          </span>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Invite collaborators
        </button>
      </div>
    </div>
  );
}
