import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, Trash2, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { documents, createDocument, deleteDocument } = useDocument();
  const { user } = useAuth();

  const handleCreateDocument = async () => {
    const id = await createDocument();
    if (id) navigate(`/editor/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="text-gray-600 mt-1">Collaborative email drafts</p>
          </div>
          <Button onClick={handleCreateDocument} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Document
          </Button>
        </div>

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
                      {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
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
              
              {doc.subject && (
                <p className="text-sm text-gray-700 mb-2 font-medium">{doc.subject}</p>
              )}
              
              {doc.content && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {doc.content}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>Shared document</span>
              </div>
            </Card>
          ))}
        </div>

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
