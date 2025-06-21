
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { SMTPSettings } from '../types/email';
import { useTranslation } from 'react-i18next';
import TestEmailDialog from './TestEmailDialog';

interface SMTPActionsProps {
  settings: SMTPSettings;
  onTestConnection: () => void;
  testing: boolean;
  onSendTestEmail?: (testEmailData: { to: string; subject: string; message: string }) => Promise<{ success: boolean }>;
  sendingTestEmail: boolean;
}

const SMTPActions: React.FC<SMTPActionsProps> = ({
  settings,
  onTestConnection,
  testing,
  onSendTestEmail,
  sendingTestEmail
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 justify-end">
      <Button 
        onClick={onTestConnection} 
        disabled={testing || !settings.host || !settings.username}
        variant="outline"
      >
        <Mail className="h-4 w-4 mr-2" />
        {testing ? t('settings.email.testing') : t('settings.email.smtp.testConnection')}
      </Button>

      {onSendTestEmail && (
        <TestEmailDialog
          disabled={!settings.host || !settings.username || !settings.fromEmail}
          sendingTestEmail={sendingTestEmail}
          onSendTestEmail={onSendTestEmail}
        />
      )}
    </div>
  );
};

export default SMTPActions;
