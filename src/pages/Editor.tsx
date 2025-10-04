import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save, Send } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  to_email: string;
  from_email: string;
  subject: string;
  content: string;
  content_delta?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && user) {
      loadDocument(id);
    }
  }, [id, user]);

  const loadDocument = async (documentId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .eq('created_by', user?.id)
        .single();

      if (error) throw error;
      setDocument(data);
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = async (htmlContent: string, jsonContent: any) => {
    if (!document) return;
    
    // Update local state immediately
    setDocument({ ...document, content: htmlContent, content_delta: jsonContent });
    
    // Debounce the database save
    setSaving(true);
    try {
      await supabase
        .from('documents')
        .update({
          content: htmlContent,
          content_delta: jsonContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id);
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleMetadataChange = async (field: string, value: string) => {
    if (!document) return;
    
    setDocument({ ...document, [field]: value });
    
    try {
      await supabase
        .from('documents')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', document.id);
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!document) {
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            {document.title || 'Untitled Email'}
          </h1>
          <div className="flex items-center gap-2">
            {saving && <span className="text-sm text-gray-500">Saving...</span>}
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Email Metadata */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From:</label>
                <input
                  type="email"
                  value={document.from_email || ''}
                  onChange={(e) => handleMetadataChange('from_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="from@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
                <input
                  type="email"
                  value={document.to_email || ''}
                  onChange={(e) => handleMetadataChange('to_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="to@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
              <input
                type="text"
                value={document.subject || ''}
                onChange={(e) => handleMetadataChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email subject..."
              />
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-lg shadow-sm border">
          <RichTextEditor
            content={document.content}
            contentDelta={document.content_delta}
            onChange={handleContentChange}
            placeholder="Start composing your email..."
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
}
