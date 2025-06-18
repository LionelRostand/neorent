
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Mail, Inbox } from 'lucide-react';
import { IMAPSettings } from '../types/email';
import { useTranslation } from 'react-i18next';

interface IMAPConfigProps {
  settings: IMAPSettings;
  onSettingsChange: (settings: IMAPSettings) => void;
  onTestConnection: () => void;
  testing?: boolean;
}

const IMAPConfig: React.FC<IMAPConfigProps> = ({
  settings,
  onSettingsChange,
  onTestConnection,
  testing = false
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof IMAPSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          {t('settings.email.imap.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imap-host">{t('settings.email.imap.server')}</Label>
            <Input
              id="imap-host"
              value={settings.host}
              onChange={(e) => handleChange('host', e.target.value)}
              placeholder="imap.gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imap-port">{t('settings.email.imap.port')}</Label>
            <Input
              id="imap-port"
              type="number"
              value={settings.port}
              onChange={(e) => handleChange('port', parseInt(e.target.value) || 993)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imap-username">{t('settings.email.imap.username')}</Label>
            <Input
              id="imap-username"
              value={settings.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="votre@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imap-password">{t('settings.email.imap.password')}</Label>
            <Input
              id="imap-password"
              type="password"
              value={settings.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imap-security">{t('settings.email.imap.security')}</Label>
            <Select 
              value={settings.security} 
              onValueChange={(value: 'none' | 'tls' | 'ssl') => handleChange('security', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('settings.email.securityOptions.none')}</SelectItem>
                <SelectItem value="tls">{t('settings.email.securityOptions.tls')}</SelectItem>
                <SelectItem value="ssl">{t('settings.email.securityOptions.ssl')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imap-folder">{t('settings.email.imap.folder')}</Label>
            <Input
              id="imap-folder"
              value={settings.folder}
              onChange={(e) => handleChange('folder', e.target.value)}
              placeholder="INBOX"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onTestConnection} 
            disabled={testing || !settings.host || !settings.username}
            variant="outline"
          >
            <Mail className="h-4 w-4 mr-2" />
            {testing ? t('settings.email.testing') : t('settings.email.imap.testConnection')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IMAPConfig;
