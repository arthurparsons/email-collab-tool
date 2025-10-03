import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Document {
  id: string;
  title: string;
  to_email: string;
  from_email: string;
  subject: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Presence {
  user_id: string;
  user_name: string;
  cursor_position: number;
  color: string;
}

interface DocumentContextType {
  currentDocument: Document | null;
  documents: Document[];
  presence: Presence[];
  loading: boolean;
  createDocument: () => Promise<string | null>;
  loadDocument: (id: string) => Promise<void>;
  updateDocument: (updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updatePresence: (cursorPosition: number) => Promise<void>;
  channel: RealtimeChannel | null;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [presence, setPresence] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });
    if (data) setDocuments(data);
  };

  const createDocument = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: 'Untitled Email',
        created_by: user.id,
        from_email: user.email
      })
      .select()
      .single();
    if (data) {
      setDocuments([data, ...documents]);
      return data.id;
    }
    return null;
  };

  const loadDocument = async (id: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      setCurrentDocument(data);
      setupRealtimeSubscription(id);
    }
    setLoading(false);
  };

  const setupRealtimeSubscription = (documentId: string) => {
    if (channel) channel.unsubscribe();

    const newChannel = supabase.channel(`document:${documentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'documents',
        filter: `id=eq.${documentId}`
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setCurrentDocument(payload.new as Document);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = newChannel.presenceState();
        const presenceList: Presence[] = [];
        Object.keys(state).forEach((key, index) => {
          const presences = state[key] as any[];
          presences.forEach((p) => {
            presenceList.push({
              ...p,
              color: colors[index % colors.length]
            });
          });
        });
        setPresence(presenceList.filter(p => p.user_id !== user?.id));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await newChannel.track({
            user_id: user.id,
            user_name: user.user_metadata?.full_name || user.email,
            cursor_position: 0
          });
        }
      });

    setChannel(newChannel);
  };

  const updateDocument = async (updates: Partial<Document>) => {
    if (!currentDocument) return;
    await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', currentDocument.id);
  };

  const deleteDocument = async (id: string) => {
    await supabase.from('documents').delete().eq('id', id);
    setDocuments(documents.filter(d => d.id !== id));
  };

  const updatePresence = async (cursorPosition: number) => {
    if (channel && user) {
      await channel.track({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        cursor_position: cursorPosition
      });
    }
  };

  return (
    <DocumentContext.Provider value={{
      currentDocument,
      documents,
      presence,
      loading,
      createDocument,
      loadDocument,
      updateDocument,
      deleteDocument,
      updatePresence,
      channel
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) throw new Error('useDocument must be used within DocumentProvider');
  return context;
};
