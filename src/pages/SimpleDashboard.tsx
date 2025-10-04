import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function SimpleDashboard() {
  console.log('SimpleDashboard rendering');
  
  const { user, loading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState(null);
  
  console.log('Auth state:', { user: !!user, loading, email: user?.email });
  
  useEffect(() => {
    if (user) {
      testDatabaseConnection();
    }
  }, [user]);
  
  const testDatabaseConnection = async () => {
    console.log('Testing database connection...');
    setDbLoading(true);
    setDbError(null);
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('created_by', user.id)
        .limit(5);
      
      console.log('Database result:', { data, error });
      
      if (error) {
        throw error;
      }
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Database error:', error);
      setDbError(error.message);
    } finally {
      setDbLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ padding: '20px', background: '#f0f0f0' }}>
        <h1>Loading...</h1>
        <p>Checking authentication...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div style={{ padding: '20px', background: '#ffe6e6' }}>
        <h1>Not Authenticated</h1>
        <p>No user found</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', background: '#e6ffe6' }}>
      <h1>Dashboard - Testing Database</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', border: '1px solid #ccc' }}>
        <h3>Authentication:</h3>
        <p>✅ User: {user.email}</p>
        <p>✅ User ID: {user.id}</p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', border: '1px solid #ccc' }}>
        <h3>Database Test:</h3>
        {dbLoading && <p>🔄 Loading documents...</p>}
        {dbError && <p style={{ color: 'red' }}>❌ Error: {dbError}</p>}
        {!dbLoading && !dbError && (
          <>
            <p>✅ Database connected successfully!</p>
            <p>Found {documents.length} documents</p>
            {documents.length > 0 && (
              <ul>
                {documents.map((doc, i) => (
                  <li key={i}>{doc.title || 'Untitled'} - {doc.id}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      
      <button onClick={testDatabaseConnection}>
        Test Database Again
      </button>
      <br /><br />
      
      <button onClick={() => console.log('Full user:', user, 'Documents:', documents)}>
        Log All Data
      </button>
      <br /><br />
      
      <a href="/">Back to Home</a>
    </div>
  );
}
