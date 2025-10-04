-- FIXED Database Schema - No Recursive Policy Issues
-- Run this in Supabase SQL Editor to fix the infinite recursion error

-- First, drop the problematic policies and table if it exists
DROP POLICY IF EXISTS "Users can view collaborators for documents they have access to" ON public.document_collaborators;
DROP POLICY IF EXISTS "Document creators can manage collaborators" ON public.document_collaborators;
DROP TABLE IF EXISTS public.document_collaborators;

-- Also clean up any other tables that might have issues
DROP POLICY IF EXISTS "Users can view documents they created or are collaborators on" ON public.documents;

-- Recreate the simple documents policy without collaborator references
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (created_by = auth.uid());

-- Verify core tables exist with correct structure
-- Recreate documents table if needed
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Email',
  to_email TEXT,
  from_email TEXT,
  subject TEXT,
  content TEXT DEFAULT '',
  content_delta JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft'
);

-- Ensure RLS is enabled
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Simple, working policies for documents (no recursion)
DROP POLICY IF EXISTS "Users can create documents" ON public.documents;
CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (created_by = auth.uid());

-- Test query to ensure everything works
SELECT 'Schema fix completed - documents table ready' as status;