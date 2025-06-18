
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Mail, Send } from 'lucide-react';
import { SMTPSettings } from '../types/email';
import { useTranslation } from 'react-i18next';

interface SMTPConfigProps {
  settings: SMTPSettings;
  onSettingsChange: (settings: SMTPSettings) => void;
  onTestConnection: () => void;
  testing?: boolean;
}

const SMTPConfig: React.FC<SMTPConfigProps> = ({
  settings,
  onSettingsChange,
  onTestConnection,
  testing = false
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof SMTPSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          {t('settings.email.smtp.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">{t('settings.email.smtp.server')}</Label>
            <Input
              id="smtp-host"
              value={settings.host}
              onChange={(e) => handleChange('host', e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">{t('settings.email.smtp.port')}</Label>
            <Input
              id="smtp-port"
              type="number"
              value={settings.port}
              onChange={(e) => handleChange('port', parseInt(e.target.value) || 587)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-username">{t('settings.email.smtp.username')}</Label>
            <Input
              id="smtp-username"
              value={settings.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="votre@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-password">{t('settings.email.smtp.password')}</Label>
            <Input
              id="smtp-password"
              type="password"
              value={settings.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smtp-security">{t('settings.email.smtp.security')}</Label>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-email">{t('settings.email.smtp.fromEmail')}</Label>
            <Input
              id="from-email"
              value={settings.fromEmail}
              onChange={(e) => handleChange('fromEmail', e.target.value)}
              placeholder="noreply@votre-domaine.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="from-name">{t('settings.email.smtp.fromName')}</Label>
            <Input
              id="from-name"
              value={settings.fromName}
              onChange={(e) => handleChange('fromName', e.target.value)}
              placeholder="NeoRent"
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
            {testing ? t('settings.email.testing') : t('settings.email.smtp.testConnection')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SMTPConfig;
