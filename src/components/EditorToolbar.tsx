import React from 'react';

export default function EditorToolbar() {
  const tools = [
    { icon: '𝐁', label: 'Bold', shortcut: '⌘B' },
    { icon: '𝐼', label: 'Italic', shortcut: '⌘I' },
    { icon: 'U̲', label: 'Underline', shortcut: '⌘U' },
    { icon: '≡', label: 'Align', shortcut: '' },
    { icon: '•', label: 'Bullet List', shortcut: '' },
    { icon: '1.', label: 'Numbered List', shortcut: '' },
    { icon: '🔗', label: 'Link', shortcut: '⌘K' },
    { icon: '📎', label: 'Attach', shortcut: '' },
    { icon: '😊', label: 'Emoji', shortcut: '' },
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-1 flex-wrap">
        {tools.map((tool, index) => (
          <button
            key={index}
            className="px-3 py-2 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium transition-colors"
            title={`${tool.label} ${tool.shortcut}`}
          >
            {tool.icon}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors">
            Save Draft
          </button>
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
