import React from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { Button } from '@/components/ui/button';
import { Save, Send, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditorToolbar() {
  const { currentDocument, updateDocument } = useDocument();
  const { toast } = useToast();

  const handleSaveDraft = async () => {
    if (currentDocument) {
      await updateDocument({ status: 'draft' });
      toast({
        title: 'Draft saved',
        description: 'Your email draft has been saved successfully.',
      });
    }
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending
    toast({
      title: 'Coming soon',
      description: 'Email sending functionality will be implemented next.',
    });
  };

  const handleShare = () => {
    // TODO: Implement sharing
    toast({
      title: 'Coming soon', 
      description: 'Document sharing functionality will be implemented next.',
    });
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {currentDocument?.status === 'draft' ? 'Draft' : 'Document'} • 
          Last saved {currentDocument ? 'just now' : 'never'}
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-1" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button size="sm" onClick={handleSendEmail}>
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
