
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Shield } from 'lucide-react';

interface SessionSecurityConfigProps {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  onSessionTimeoutChange: (timeout: number) => void;
  onMaxLoginAttemptsChange: (attempts: number) => void;
  onLockoutDurationChange: (duration: number) => void;
}

const SessionSecurityConfig: React.FC<SessionSecurityConfigProps> = ({
  sessionTimeout,
  maxLoginAttempts,
  lockoutDuration,
  onSessionTimeoutChange,
  onMaxLoginAttemptsChange,
  onLockoutDurationChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Sécurité des sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
            <Select 
              value={sessionTimeout.toString()} 
              onValueChange={(value) => onSessionTimeoutChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
                <SelectItem value="480">8 heures</SelectItem>
                <SelectItem value="0">Jamais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              min="3"
              max="10"
              value={maxLoginAttempts}
              onChange={(e) => onMaxLoginAttemptsChange(parseInt(e.target.value) || 5)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lockoutDuration">Durée de verrouillage (minutes)</Label>
          <Select 
            value={lockoutDuration.toString()} 
            onValueChange={(value) => onLockoutDurationChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Recommandations de sécurité</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Utilisez un timeout de session de 30 minutes maximum</li>
                <li>• Limitez les tentatives de connexion à 5 maximum</li>
                <li>• Activez la double authentification pour tous les comptes</li>
                <li>• Vérifiez régulièrement les journaux de connexion</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionSecurityConfig;
