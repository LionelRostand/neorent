
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Copy, Upload, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/lib/firebase';
import { firestoreRules } from './FirestoreRulesData';
import { FirestoreRulesDisplay } from './FirestoreRulesDisplay';
import FirestoreRulesInfo from './FirestoreRulesInfo';
import { firestoreRulesService } from '@/services/firestoreRulesService';
import { useTranslation } from 'react-i18next';

interface FirestoreRulesSectionProps {
  onCopy: (text: string, type: string) => void;
}

export const FirestoreRulesSection: React.FC<FirestoreRulesSectionProps> = ({ onCopy }) => {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleAutomaticUpdate = async () => {
    setIsUpdating(true);
    try {
      const success = await firestoreRulesService.updateRulesAutomatically(
        firestoreRules, 
        firebaseConfig.projectId
      );
      
      if (success) {
        toast({
          title: t('settings.firebase.rulesUpdated'),
          description: t('settings.firebase.rulesAppliedSuccess'),
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour automatique:', error);
      toast({
        title: t('settings.firebase.automaticUpdateUnavailable'),
        description: t('settings.firebase.useManualUpdate'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualUpdate = () => {
    const instructions = firestoreRulesService.generateUpdateInstructions(
      firestoreRules,
      firebaseConfig.projectId
    );
    
    onCopy(instructions, t('settings.firebase.manualUpdateInstructions'));
    
    toast({
      title: t('settings.firebase.instructionsCopied'),
      description: t('settings.firebase.followInstructions'),
    });
  };

  const openFirebaseRulesConsole = () => {
    firestoreRulesService.openFirebaseConsole(firebaseConfig.projectId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            {t('settings.firebase.firestoreRules')}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCopy(firestoreRules, 'Firestore')}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {t('settings.firebase.copy')}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAutomaticUpdate}
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUpdating ? t('settings.firebase.updating') : t('settings.firebase.applyAuto')}
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleManualUpdate}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {t('settings.firebase.manualUpdate')}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            {t('settings.firebase.copyInstructions')}
          </p>

          {/* Status alerts */}
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-sm">ℹ️</span>
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">{t('settings.firebase.updateOptions')}:</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <strong>{t('settings.firebase.automatic')}:</strong> {t('settings.firebase.automaticDescription')}</li>
                    <li>• <strong>{t('settings.firebase.manual')}:</strong> {t('settings.firebase.manualDescription')}</li>
                    <li>• <strong>{t('settings.firebase.copy')}:</strong> {t('settings.firebase.copyDescription')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 text-sm">⚠️</span>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">{t('settings.firebase.important')}:</p>
                  <p className="text-yellow-700">
                    {t('settings.firebase.automaticRequirements')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <FirestoreRulesDisplay />
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={openFirebaseRulesConsole}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {t('settings.firebase.openConsole')}
            </Button>
          </div>
          
          <FirestoreRulesInfo />
        </div>
      </CardContent>
    </Card>
  );
};
