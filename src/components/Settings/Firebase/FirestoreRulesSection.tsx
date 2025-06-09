
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Copy, Upload, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/lib/firebase';
import { firestoreRules } from './FirestoreRulesData';
import { FirestoreRulesDisplay } from './FirestoreRulesDisplay';
import { FirestoreRulesInfo } from './FirestoreRulesInfo';
import { firestoreRulesService } from '@/services/firestoreRulesService';

interface FirestoreRulesSectionProps {
  onCopy: (text: string, type: string) => void;
}

export const FirestoreRulesSection: React.FC<FirestoreRulesSectionProps> = ({ onCopy }) => {
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
          title: "Règles mises à jour !",
          description: "Les règles Firestore ont été appliquées avec succès.",
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour automatique:', error);
      toast({
        title: "Mise à jour automatique indisponible",
        description: "Utilisez la mise à jour manuelle ou contactez l'administrateur.",
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
    
    onCopy(instructions, 'Instructions de mise à jour manuelle');
    
    toast({
      title: "Instructions copiées !",
      description: "Suivez les instructions pour mettre à jour manuellement.",
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
            Règles de sécurité Firestore
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCopy(firestoreRules, 'Firestore')}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copier
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
              {isUpdating ? 'Mise à jour...' : 'Appliquer auto'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleManualUpdate}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Mise à jour manuelle
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Copiez et collez ces règles dans votre console Firebase ou utilisez la mise à jour automatique :
          </p>

          {/* Alertes de statut */}
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-sm">ℹ️</span>
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Options de mise à jour :</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <strong>Automatique :</strong> Applique directement les règles (nécessite configuration)</li>
                    <li>• <strong>Manuelle :</strong> Génère les instructions pour mise à jour via console Firebase</li>
                    <li>• <strong>Copier :</strong> Copie uniquement les règles dans le presse-papier</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 text-sm">⚠️</span>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Important :</p>
                  <p className="text-yellow-700">
                    La mise à jour automatique nécessite une configuration avancée avec des permissions Firebase Admin. 
                    En cas d'échec, utilisez la mise à jour manuelle.
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
              Ouvrir Console Firebase - Règles
            </Button>
          </div>
          
          <FirestoreRulesInfo />
        </div>
      </CardContent>
    </Card>
  );
};
