
import React from 'react';

export const FirestoreRulesInfo: React.FC = () => {
  return (
    <div className="mt-4 space-y-3">
      <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-green-600 text-sm">✅</span>
          <div className="text-sm">
            <p className="font-medium text-green-800 mb-1">Nouvelles fonctionnalités :</p>
            <ul className="text-green-700 space-y-1">
              <li>• <strong>Fonctions utilitaires :</strong> Simplification des vérifications de rôles</li>
              <li>• <strong>Gestion des documents :</strong> Locataires peuvent accéder à leurs documents</li>
              <li>• <strong>Maintenance :</strong> Système de demandes et interventions</li>
              <li>• <strong>Permissions employés :</strong> Gestion fine des autorisations</li>
              <li>• <strong>Configuration sécurisée :</strong> Paramètres email et sécurité</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-sm">🔒</span>
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Sécurité renforcée :</p>
            <ul className="text-blue-700 space-y-1">
              <li>• <strong>Validation des données :</strong> Contrôle des champs obligatoires</li>
              <li>• <strong>Accès contextuel :</strong> Locataires voient uniquement leurs données</li>
              <li>• <strong>Audit trail :</strong> Logs pour toutes les actions importantes</li>
              <li>• <strong>Isolation des rôles :</strong> Séparation claire des permissions</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-red-600 text-sm">🚨</span>
          <div className="text-sm">
            <p className="font-medium text-red-800 mb-1">IMPORTANT - Configuration requise :</p>
            <ul className="text-red-700 space-y-1">
              <li>• Activez l'authentification Firebase (Authentication)</li>
              <li>• Créez la collection <code className="bg-red-100 px-1 rounded">user_roles</code></li>
              <li>• Ajoutez un document avec votre UID et <code className="bg-red-100 px-1 rounded">role: "admin"</code></li>
              <li>• Testez les règles en mode test avant de publier</li>
              <li>• Vérifiez que tous vos utilisateurs ont un rôle défini</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600 text-sm">⚠️</span>
          <div className="text-sm">
            <p className="font-medium text-yellow-800 mb-1">Instructions de déploiement :</p>
            <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Copiez les règles ci-dessus</li>
              <li>Allez dans la console Firebase → Firestore Database</li>
              <li>Cliquez sur l'onglet "Règles"</li>
              <li>Remplacez le contenu par ces nouvelles règles</li>
              <li>Cliquez sur "Publier" pour appliquer les changements</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
