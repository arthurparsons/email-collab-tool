import React, { useState, useEffect } from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Change {
  id: string;
  change_type: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

export default function VersionHistory() {
  const { currentDocument } = useDocument();
  const [changes, setChanges] = useState<Change[]>([]);

  useEffect(() => {
    if (currentDocument?.id) {
      loadChanges();
    }
  }, [currentDocument?.id]);

  const loadChanges = async () => {
    if (!currentDocument) return;
    
    const { data } = await supabase
      .from('document_changes')
      .select('*')
      .eq('document_id', currentDocument.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setChanges(data);
  };

  return (
    <div className="bg-gray-50 border-l border-gray-200 w-80 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Version History</h3>
      <div className="space-y-3">
        {changes.length === 0 ? (
          <p className="text-sm text-gray-500">No changes yet</p>
        ) : (
          changes.map((change) => (
            <div key={change.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">User</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(change.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{change.change_type}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
