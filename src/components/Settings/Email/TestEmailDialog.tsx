
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, TestTube } from 'lucide-react';

interface TestEmailDialogProps {
  disabled: boolean;
  sendingTestEmail: boolean;
  onSendTestEmail: (testEmailData: { to: string; subject: string; message: string }) => Promise<{ success: boolean }>;
}

const TestEmailDialog: React.FC<TestEmailDialogProps> = ({
  disabled,
  sendingTestEmail,
  onSendTestEmail
}) => {
  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [testEmailData, setTestEmailData] = useState({
    to: '',
    subject: 'Test d\'envoi depuis NeoRent',
    message: 'Ceci est un email de test envoyé depuis la configuration SMTP de NeoRent.\n\nSi vous recevez cet email, la configuration fonctionne correctement.'
  });

  const handleSendTestEmail = async () => {
    const result = await onSendTestEmail(testEmailData);
    if (result.success) {
      setTestEmailOpen(false);
    }
  };

  return (
    <Dialog open={testEmailOpen} onOpenChange={setTestEmailOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={disabled}
          variant="default"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Tester l'envoi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Test d'envoi d'email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email-to">Destinataire</Label>
            <Input
              id="test-email-to"
              type="email"
              placeholder="test@example.com"
              value={testEmailData.to}
              onChange={(e) => setTestEmailData(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-email-subject">Sujet</Label>
            <Input
              id="test-email-subject"
              value={testEmailData.subject}
              onChange={(e) => setTestEmailData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-email-message">Message</Label>
            <Textarea
              id="test-email-message"
              rows={4}
              value={testEmailData.message}
              onChange={(e) => setTestEmailData(prev => ({ ...prev, message: e.target.value }))}
              className="resize-none"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setTestEmailOpen(false)}
              disabled={sendingTestEmail}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSendTestEmail}
              disabled={sendingTestEmail || !testEmailData.to}
            >
              <Send className="h-4 w-4 mr-2" />
              {sendingTestEmail ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestEmailDialog;
