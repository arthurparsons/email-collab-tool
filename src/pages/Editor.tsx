import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocument } from '@/contexts/DocumentContext';
import EditorDemo from '@/components/EditorDemo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadDocument, currentDocument, loading } = useDocument();

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!currentDocument && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document not found</h2>
          <p className="text-gray-600 mb-4">The document you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            {currentDocument?.title || 'Untitled Email'}
          </h1>
          <div className="w-32" />
        </div>
      </div>
      <EditorDemo />
    </div>
  );
}
