import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TestDashboard() {
  console.log('TestDashboard component rendering');
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  console.log('Dashboard state:', { user: !!user, loading, userEmail: user?.email });

  if (loading) {
    console.log('Dashboard: showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auth state...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: no user, should redirect');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No user found - redirecting to login...</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  console.log('Dashboard: rendering main content');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Dashboard</h1>
              <p className="text-gray-600 mt-1">Debug version - checking auth state</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication Debug Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User exists:</strong> {user ? 'Yes' : 'No'}</p>
            <p><strong>User email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Auth loading:</strong> {loading ? 'Yes' : 'No'}</p>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button 
              onClick={() => console.log('Current user:', user)}
              variant="outline"
            >
              Log User to Console
            </Button>
            
            <Button 
              onClick={() => alert('Dashboard is working!')}
              className="ml-3"
            >
              Test Alert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}