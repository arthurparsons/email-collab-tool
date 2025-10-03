import React, { useState, useEffect } from 'react';
import { useDocument } from '@/contexts/DocumentContext';

export default function EmailMetadata() {
  const { currentDocument, updateDocument } = useDocument();
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    if (currentDocument) {
      setTo(currentDocument.to_email || '');
      setFrom(currentDocument.from_email || '');
      setSubject(currentDocument.subject || '');
    }
  }, [currentDocument?.id]);

  const handleBlur = (field: string, value: string) => {
    updateDocument({ [field]: value });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600 w-16">To:</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          onBlur={(e) => handleBlur('to_email', e.target.value)}
          placeholder="Add recipients..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600 w-16">From:</label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          onBlur={(e) => handleBlur('from_email', e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600 w-16">Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onBlur={(e) => handleBlur('subject', e.target.value)}
          placeholder="Email subject..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
