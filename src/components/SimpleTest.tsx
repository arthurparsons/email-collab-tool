import React from 'react';

export default function SimpleTest() {
  console.log('SimpleTest component rendered');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">React App is Working! 🎉</h1>
        <p className="text-gray-600 mb-4">
          The application is now loading successfully.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Environment Check:</h2>
          <p className="text-sm">
            <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Missing'}
          </p>
          <p className="text-sm">
            <strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}
          </p>
        </div>
        <div className="mt-4">
          <a 
            href="/login" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Go to Login
          </a>
          <a 
            href="/signup" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Signup
          </a>
        </div>
      </div>
    </div>
  );
}