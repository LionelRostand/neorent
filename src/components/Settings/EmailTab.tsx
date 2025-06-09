
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Mail } from 'lucide-react';
import { useEmailSettings } from '@/hooks/useEmailSettings';
import SMTPConfig from './Email/SMTPConfig';
import IMAPConfig from './Email/IMAPConfig';

const EmailTab: React.FC = () => {
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
          <p className="mt-2 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paramètres Email</h2>
          <p className="text-gray-600">
            Configurez l'envoi et la réception d'emails pour votre application
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
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
          Activer le système de messagerie
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
              Mode test (les emails ne seront pas réellement envoyés)
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
            <h4 className="font-medium text-green-900 mb-2">Configuration recommandée</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Gmail: SMTP smtp.gmail.com:587 (TLS), IMAP imap.gmail.com:993 (SSL)</li>
              <li>• Outlook: SMTP smtp-mail.outlook.com:587 (TLS), IMAP outlook.office365.com:993 (SSL)</li>
              <li>• Utilisez des mots de passe d'application pour une sécurité renforcée</li>
              <li>• Testez toujours vos connexions avant de sauvegarder</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailTab;
