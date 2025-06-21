
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SMTPSettings } from '../types/email';
import { useTranslation } from 'react-i18next';

interface SMTPFormFieldsProps {
  settings: SMTPSettings;
  onSettingsChange: (settings: SMTPSettings) => void;
}

const SMTPFormFields: React.FC<SMTPFormFieldsProps> = ({
  settings,
  onSettingsChange
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof SMTPSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default SMTPFormFields;
