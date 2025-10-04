-- COMPLETE DATABASE CLEANUP AND FIX
-- This will remove all problematic tables and policies, then recreate a clean setup

-- Step 1: Drop all problematic policies first
DROP POLICY IF EXISTS "Users can view documents they collaborate on" ON public.documents;
DROP POLICY IF EXISTS "Document owners and editors can update" ON public.documents;
DROP POLICY IF EXISTS "Users can view changes of their documents" ON public.document_changes;
DROP POLICY IF EXISTS "Users can insert changes to documents they can edit" ON public.document_changes;
DROP POLICY IF EXISTS "Users can view presence in their documents" ON public.user_presence;

-- Step 2: Drop all problematic tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.user_presence CASCADE;
DROP TABLE IF EXISTS public.document_changes CASCADE;
DROP TABLE IF EXISTS public.document_collaborators CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.document_versions CASCADE;
DROP TABLE IF EXISTS public.email_sends CASCADE;

-- Step 3: Clean up any remaining policies on documents table
DROP POLICY IF EXISTS "Users can view documents they created or are collaborators on" ON public.documents;
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents they created or have edit permission" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete documents they created" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

-- Step 4: Recreate a clean documents table
DROP TABLE IF EXISTS public.documents CASCADE;
CREATE TABLE public.documents (
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

-- Step 5: Enable RLS and create simple, working policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (created_by = auth.uid());

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON public.documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON public.documents(updated_at DESC);

-- Step 7: Verify the setup works
SELECT 'Database cleanup completed successfully!' as status;

-- Test query to make sure everything works
SELECT COUNT(*) as document_count FROM public.documents;