import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Smartphone, Mail, QrCode, Key, Copy } from 'lucide-react';
import { TwoFactorSettings } from '../types/security';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface TwoFactorConfigProps {
  settings: TwoFactorSettings;
  onSettingsChange: (settings: TwoFactorSettings) => void;
}

const TwoFactorConfig: React.FC<TwoFactorConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const { t } = useTranslation();
  const [isEnabling, setIsEnabling] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { toast } = useToast();

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    return codes;
  };

  const enable2FA = async () => {
    setIsEnabling(true);
    try {
      // Simuler la génération d'un secret et QR code
      const newBackupCodes = generateBackupCodes();
      
      onSettingsChange({
        ...settings,
        enabled: true,
        backupCodes: newBackupCodes,
        lastUpdated: new Date().toISOString()
      });

      toast({
        title: t('settings.security.twoFactor.enabled'),
        description: t('settings.security.twoFactor.enabledDescription'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.security.twoFactor.enableError'),
        variant: "destructive",
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const disable2FA = () => {
    onSettingsChange({
      ...settings,
      enabled: false,
      backupCodes: []
    });

    toast({
      title: t('settings.security.twoFactor.disabled'),
      description: t('settings.security.twoFactor.disabledDescription'),
    });
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast({
      title: t('settings.security.twoFactor.codesCopied'),
      description: t('settings.security.twoFactor.codesCopiedDescription'),
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'authenticator': return <QrCode className="h-4 w-4" />;
      default: return <Key className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          {t('settings.security.twoFactor.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>{t('settings.security.twoFactor.enable')}</Label>
            <p className="text-sm text-gray-500">
              {t('settings.security.twoFactor.enableDescription')}
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setIsEnabling(true);
              } else {
                disable2FA();
              }
            }}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="space-y-2">
              <Label>{t('settings.security.twoFactor.verificationMethod')}</Label>
              <Select 
                value={settings.method} 
                onValueChange={(value: 'sms' | 'email' | 'authenticator') => 
                  onSettingsChange({ ...settings, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('settings.security.twoFactor.methods.email')}
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      {t('settings.security.twoFactor.methods.sms')}
                    </div>
                  </SelectItem>
                  <SelectItem value="authenticator">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      {t('settings.security.twoFactor.methods.authenticator')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.backupCodes.length > 0 && (
              <div className="space-y-2">
                <Label>{t('settings.security.twoFactor.backupCodes')}</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      {t('settings.security.twoFactor.backupCodesDescription')}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyBackupCodes}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {t('settings.security.twoFactor.copy')}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    {settings.backupCodes.map((code, index) => (
                      <div key={index} className="p-1 bg-white rounded">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => setBackupCodes(generateBackupCodes())}
              >
                {t('settings.security.twoFactor.generateNewCodes')}
              </Button>
            </div>
          </>
        )}

        {isEnabling && (
          <AlertDialog open={isEnabling} onOpenChange={setIsEnabling}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('settings.security.twoFactor.enableTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {settings.method === 'email' && 
                    t('settings.security.twoFactor.emailDescription')
                  }
                  {settings.method === 'sms' && 
                    t('settings.security.twoFactor.smsDescription')
                  }
                  {settings.method === 'authenticator' && 
                    t('settings.security.twoFactor.authenticatorDescription')
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              {settings.method === 'authenticator' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    {t('settings.security.twoFactor.qrCodeDescription')}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>{t('settings.security.twoFactor.verificationCode')}</Label>
                <InputOTP value={verificationCode} onChange={setVerificationCode} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>{t('forms.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={enable2FA}
                  disabled={verificationCode.length !== 6}
                >
                  {t('settings.security.twoFactor.enable2FA')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorConfig;
