
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Mail } from 'lucide-react';
import { useEmailSettings } from '@/hooks/useEmailSettings';
import SMTPConfig from './Email/SMTPConfig';
import IMAPConfig from './Email/IMAPConfig';
import { useTranslation } from 'react-i18next';

const EmailTab: React.FC = () => {
  const { t } = useTranslation();
  const { 
    settings, 
    loading, 
    saving, 
    testingSMTP,
    testingIMAP,
    saveSettings, 
    updateSettings,
    testSMTPConnection,
    testIMAPConnection
  } = useEmailSettings();

  const handleSave = () => {
    saveSettings(settings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('settings.email.loadingSettings')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('settings.email.title')}</h2>
          <p className="text-gray-600">
            {t('settings.email.subtitle')}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? t('settings.email.saving') : t('common.save')}
        </Button>
      </div>

      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
        <Switch
          id="email-enabled"
          checked={settings.enabled}
          onCheckedChange={(enabled) => 
            updateSettings({ ...settings, enabled })
          }
        />
        <Label htmlFor="email-enabled" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {t('settings.email.enabled')}
        </Label>
      </div>

      {settings.enabled && (
        <>
          <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded-lg">
            <Switch
              id="test-mode"
              checked={settings.testMode}
              onCheckedChange={(testMode) => 
                updateSettings({ ...settings, testMode })
              }
            />
            <Label htmlFor="test-mode">
              {t('settings.email.testMode')}
            </Label>
          </div>

          <SMTPConfig
            settings={settings.smtp}
            onSettingsChange={(smtp) => 
              updateSettings({ ...settings, smtp })
            }
            onTestConnection={testSMTPConnection}
            testing={testingSMTP}
          />

          <IMAPConfig
            settings={settings.imap}
            onSettingsChange={(imap) => 
              updateSettings({ ...settings, imap })
            }
            onTestConnection={testIMAPConnection}
            testing={testingIMAP}
          />

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">{t('settings.email.recommendedConfig')}</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• {t('settings.email.gmailConfig')}</li>
              <li>• {t('settings.email.outlookConfig')}</li>
              <li>• {t('settings.email.appPasswordRecommendation')}</li>
              <li>• {t('settings.email.testConnectionRecommendation')}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailTab;
