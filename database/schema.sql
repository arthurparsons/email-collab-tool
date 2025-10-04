-- Collaborative Email Editor Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Email',
  to_email TEXT,
  from_email TEXT,
  subject TEXT,
  content TEXT DEFAULT '',
  content_delta JSONB, -- For rich text editor delta format
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_template BOOLEAN DEFAULT false,
  template_category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Create document_collaborators table for sharing/permissions
CREATE TABLE public.document_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT DEFAULT 'edit' CHECK (permission IN ('view', 'comment', 'edit', 'admin')),
  invited_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(document_id, user_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  position_start INTEGER, -- Character position for inline comments
  position_end INTEGER,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_versions table for version history
CREATE TABLE public.document_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_delta JSONB,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create presence table for real-time collaboration
CREATE TABLE public.presence (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cursor_position INTEGER DEFAULT 0,
  selection_start INTEGER,
  selection_end INTEGER,
  color TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, user_id)
);

-- Create email_sends table for tracking sent emails
CREATE TABLE public.email_sends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  sent_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  to_emails TEXT[] NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  provider TEXT, -- 'sendgrid', 'ses', etc.
  provider_id TEXT, -- External email ID for tracking
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX idx_documents_created_by ON public.documents(created_by);
CREATE INDEX idx_documents_updated_at ON public.documents(updated_at DESC);
CREATE INDEX idx_document_collaborators_document_id ON public.document_collaborators(document_id);
CREATE INDEX idx_document_collaborators_user_id ON public.document_collaborators(user_id);
CREATE INDEX idx_comments_document_id ON public.comments(document_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_presence_document_id ON public.presence(document_id);
CREATE INDEX idx_presence_last_seen ON public.presence(last_seen DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view documents they created or are collaborators on" ON public.documents
  FOR SELECT USING (
    created_by = auth.uid() OR
    id IN (
      SELECT document_id FROM public.document_collaborators 
      WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update documents they created or have edit permission" ON public.documents
  FOR UPDATE USING (
    created_by = auth.uid() OR
    id IN (
      SELECT document_id FROM public.document_collaborators 
      WHERE user_id = auth.uid() AND permission IN ('edit', 'admin') AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can delete documents they created" ON public.documents
  FOR DELETE USING (created_by = auth.uid());

-- Document collaborators policies
CREATE POLICY "Users can view collaborators for documents they have access to" ON public.document_collaborators
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM public.documents WHERE created_by = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Document creators can manage collaborators" ON public.document_collaborators
  FOR ALL USING (
    document_id IN (
      SELECT id FROM public.documents WHERE created_by = auth.uid()
    )
  );

-- Comments policies
CREATE POLICY "Users can view comments on accessible documents" ON public.comments
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM public.documents 
      WHERE created_by = auth.uid() OR
      id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
      )
    )
  );

CREATE POLICY "Users can create comments on accessible documents" ON public.comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    document_id IN (
      SELECT id FROM public.documents 
      WHERE created_by = auth.uid() OR
      id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid() AND permission IN ('comment', 'edit', 'admin') AND accepted_at IS NOT NULL
      )
    )
  );

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (user_id = auth.uid());

-- Presence policies
CREATE POLICY "Users can view presence for accessible documents" ON public.presence
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM public.documents 
      WHERE created_by = auth.uid() OR
      id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
      )
    )
  );

CREATE POLICY "Users can manage own presence" ON public.presence
  FOR ALL USING (user_id = auth.uid());

-- Functions and triggers

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create document version on update
CREATE OR REPLACE FUNCTION public.create_document_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title THEN
    INSERT INTO public.document_versions (
      document_id, 
      version_number, 
      title, 
      content, 
      content_delta,
      changed_by
    ) VALUES (
      OLD.id,
      COALESCE((
        SELECT MAX(version_number) + 1 
        FROM public.document_versions 
        WHERE document_id = OLD.id
      ), 1),
      OLD.title,
      OLD.content,
      OLD.content_delta,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for document versioning
CREATE TRIGGER document_versioning
  AFTER UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.create_document_version();

-- Function to clean up old presence data
CREATE OR REPLACE FUNCTION public.cleanup_old_presence()
RETURNS void AS $$
BEGIN
  DELETE FROM public.presence 
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- You can set up a cron job to run this function periodically
-- SELECT cron.schedule('cleanup-presence', '*/5 * * * *', 'SELECT public.cleanup_old_presence();');