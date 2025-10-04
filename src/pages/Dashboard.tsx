import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, Trash2, Users, ArrowLeft, LogOut } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDocuments();
    } else if (!authLoading) {
      // Only redirect if we're done loading and still no user
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('created_by', user?.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: 'Untitled Email',
          created_by: user?.id,
          from_email: user?.email
        })
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        alert(`Document created! ID: ${data.id}`);
        loadDocuments(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        loadDocuments(); // Refresh the list
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
              <p className="text-gray-600 mt-1">Collaborative email drafts</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button onClick={handleCreateDocument} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Document
            </Button>
          </div>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading documents...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/editor/${doc.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, doc.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                
                {doc.content && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {doc.content.substring(0, 100)}...
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>Personal document</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {documents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">Create your first collaborative email document</p>
            <Button onClick={handleCreateDocument}>
              <Plus className="w-5 h-5 mr-2" />
              Create Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
