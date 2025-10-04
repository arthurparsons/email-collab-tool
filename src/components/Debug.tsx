import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Debug() {
  useEffect(() => {
    console.log('Debug component loaded');
    console.log('Environment variables:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '[PRESENT]' : '[MISSING]');
    
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        console.log('Supabase test:', { data, error });
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    };
    
    testSupabase();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Mode</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p>Check browser console for detailed logs</p>
        <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Missing'}</p>
        <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
      </div>
    </div>
  );
}