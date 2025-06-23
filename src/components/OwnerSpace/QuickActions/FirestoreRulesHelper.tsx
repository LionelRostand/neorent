
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Copy, ExternalLink, Shield, Code, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firestoreRulesService } from '@/services/firestoreRulesService';

const FirestoreRulesHelper: React.FC = () => {
  const { toast } = useToast();
  const [showRules, setShowRules] = useState(false);

  const requiredRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour la gestion des actions rapides
    match /system_config/{document} {
      // Permettre la lecture pour tous les utilisateurs authentifiés
      allow read: if request.auth != null;
      
      // Permettre l'écriture uniquement pour les administrateurs
      allow write: if request.auth != null 
        && exists(/databases/$(database)/documents/user_roles/$(request.auth.uid))
        && get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les rôles utilisateurs
    match /user_roles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null 
        && exists(/databases/$(database)/documents/user_roles/$(request.auth.uid))
        && get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles générales pour les autres collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(requiredRules);
      toast({
        title: "Copié !",
        description: "Les règles Firestore ont été copiées dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier les règles",
        variant: "destructive",
      });
    }
  };

  const openFirebaseConsole = () => {
    // Vous devrez remplacer 'your-project-id' par l'ID réel de votre projet
    const projectId = 'votre-projet-firebase'; // À remplacer par l'ID réel
    firestoreRulesService.openFirebaseConsole(projectId);
  };

  const troubleshootingSteps = [
    {
      step: 1,
      title: "Vérifiez votre rôle utilisateur",
      description: "Assurez-vous que votre utilisateur a le rôle 'admin' dans la collection user_roles",
      action: "Vérifier dans Firebase Console → Firestore → user_roles"
    },
    {
      step: 2,
      title: "Appliquez les règles Firestore",
      description: "Copiez et appliquez les règles ci-dessous dans votre projet Firebase",
      action: "Firebase Console → Firestore → Règles"
    },
    {
      step: 3,
      title: "Créez le document user_roles",
      description: "Si le document n'existe pas, créez-le avec votre UID et role: 'admin'",
      action: "Firebase Console → Firestore → Créer collection 'user_roles'"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Alerte d'erreur */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-2">Erreur de permissions détectée</h3>
              <p className="text-sm text-red-700 mb-3">
                L'erreur "Missing or insufficient permissions" indique que les règles Firestore 
                ne permettent pas à votre utilisateur de modifier la configuration des actions rapides.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowRules(true)}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Voir les règles
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={openFirebaseConsole}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Console Firebase
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Étapes de dépannage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Étapes pour corriger les permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {troubleshootingSteps.map((item) => (
            <div key={item.step} className="flex gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <Badge variant="outline" className="text-xs">
                  {item.action}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal avec les règles */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Règles Firestore requises
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Instructions d'application :</h3>
                <Button size="sm" onClick={copyRules}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier les règles
                </Button>
              </div>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Ouvrez la Console Firebase de votre projet</li>
                <li>Allez dans "Firestore Database" → "Règles"</li>
                <li>Remplacez le contenu existant par les règles ci-dessous</li>
                <li>Cliquez sur "Publier" pour appliquer les modifications</li>
              </ol>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {requiredRules}
              </pre>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Important :</p>
                  <ul className="text-amber-700 space-y-1 list-disc list-inside">
                    <li>Sauvegardez vos règles actuelles avant de les remplacer</li>
                    <li>Assurez-vous que votre utilisateur a un document dans la collection "user_roles" avec role: "admin"</li>
                    <li>Ces règles permettent la lecture à tous les utilisateurs authentifiés mais limitent l'écriture aux administrateurs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirestoreRulesHelper;
