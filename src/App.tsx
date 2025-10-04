import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TestDashboard from './pages/TestDashboard';
import SimpleDashboard from './pages/SimpleDashboard';
import Editor from './pages/Editor';

function HomePage() {
  console.log('HomePage component rendering');
  const { user, loading } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Collaborative Email Editor
        </h1>
        <p className="text-gray-600 mb-4">
          React + React Router + Auth is working!
        </p>
        
        <div className="bg-green-50 p-4 rounded mb-4">
          <p className="text-sm font-semibold mb-2">Auth Status:</p>
          {loading ? (
            <p className="text-xs text-gray-600">Loading...</p>
          ) : user ? (
            <div>
              <p className="text-xs text-green-600">✅ Logged in as: {user.email}</p>
              <p className="text-xs text-gray-600">User ID: {user.id}</p>
            </div>
          ) : (
            <p className="text-xs text-red-600">❌ Not logged in</p>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="text-sm">
            <strong>Environment:</strong>
          </p>
          <p className="text-xs text-gray-600">
            Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}
          </p>
          <p className="text-xs text-gray-600">
            Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Not set'}
          </p>
        </div>
        
        <div className="space-y-2">
          {user ? (
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Go to Login
              </Link>
              <Link 
                to="/signup" 
                className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Go to Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const App = () => {
  console.log('App component rendering');
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
