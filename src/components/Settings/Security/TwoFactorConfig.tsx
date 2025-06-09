
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

interface TwoFactorConfigProps {
  settings: TwoFactorSettings;
  onSettingsChange: (settings: TwoFactorSettings) => void;
}

const TwoFactorConfig: React.FC<TwoFactorConfigProps> = ({
  settings,
  onSettingsChange
}) => {
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
        title: "2FA activé",
        description: "L'authentification à deux facteurs a été activée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer la 2FA",
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
      title: "2FA désactivé",
      description: "L'authentification à deux facteurs a été désactivée",
    });
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast({
      title: "Codes copiés",
      description: "Les codes de secours ont été copiés dans le presse-papier",
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
          Authentification à deux facteurs (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Activer la 2FA</Label>
            <p className="text-sm text-gray-500">
              Ajoute une couche de sécurité supplémentaire à votre compte
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
              <Label>Méthode de vérification</Label>
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
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="authenticator">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Application d'authentification
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.backupCodes.length > 0 && (
              <div className="space-y-2">
                <Label>Codes de secours</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      Conservez ces codes en lieu sûr
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyBackupCodes}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copier
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
                Générer nouveaux codes de secours
              </Button>
            </div>
          </>
        )}

        {isEnabling && (
          <AlertDialog open={isEnabling} onOpenChange={setIsEnabling}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Activer l'authentification à deux facteurs</AlertDialogTitle>
                <AlertDialogDescription>
                  {settings.method === 'email' && 
                    "Un code de vérification sera envoyé à votre adresse email lors de chaque connexion."
                  }
                  {settings.method === 'sms' && 
                    "Un code de vérification sera envoyé par SMS lors de chaque connexion."
                  }
                  {settings.method === 'authenticator' && 
                    "Scannez ce QR code avec votre application d'authentification et entrez le code généré."
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
                    QR Code pour l'application d'authentification
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Code de vérification</Label>
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
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={enable2FA}
                  disabled={verificationCode.length !== 6}
                >
                  Activer la 2FA
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
