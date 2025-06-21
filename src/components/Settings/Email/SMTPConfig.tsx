
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { SMTPSettings } from '../types/email';
import { useTranslation } from 'react-i18next';
import SMTPFormFields from './SMTPFormFields';
import SMTPActions from './SMTPActions';

interface SMTPConfigProps {
  settings: SMTPSettings;
  onSettingsChange: (settings: SMTPSettings) => void;
  onTestConnection: () => void;
  testing?: boolean;
  onSendTestEmail?: (testEmailData: { to: string; subject: string; message: string }) => Promise<{ success: boolean }>;
  sendingTestEmail?: boolean;
}

const SMTPConfig: React.FC<SMTPConfigProps> = ({
  settings,
  onSettingsChange,
  onTestConnection,
  testing = false,
  onSendTestEmail,
  sendingTestEmail = false
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          {t('settings.email.smtp.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SMTPFormFields
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
        
        <SMTPActions
          settings={settings}
          onTestConnection={onTestConnection}
          testing={testing}
          onSendTestEmail={onSendTestEmail}
          sendingTestEmail={sendingTestEmail}
        />
      </CardContent>
    </Card>
  );
};

export default SMTPConfig;
