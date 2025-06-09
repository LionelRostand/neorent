
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export const FirebaseCollectionsList: React.FC = () => {
  const collections = [
    { name: 'Rent_properties', description: 'Biens immobiliers', status: 'Configuré' },
    { name: 'Rent_locataires', description: 'Locataires principaux', status: 'Configuré' },
    { name: 'Rent_colocataires', description: 'Colocataires', status: 'Configuré' },
    { name: 'Rent_contracts', description: 'Contrats de bail', status: 'Configuré' },
    { name: 'Rent_Inspections', description: 'États des lieux', status: 'Configuré' },
    { name: 'Rent_Payments', description: 'Paiements des loyers', status: 'Configuré' },
    { name: 'Rent_Charges', description: 'Charges locatives', status: 'Configuré' },
    { name: 'Rent_entreprises', description: 'Entreprises', status: 'Configuré' },
    { name: 'Rent_employees', description: 'Employés', status: 'À créer' },
    { name: 'user_roles', description: 'Rôles utilisateurs', status: 'À créer' },
    { name: 'website_config', description: 'Configuration site web', status: 'À créer' },
    { name: 'conversations', description: 'Conversations chat', status: 'Nouveau' },
    { name: 'garage_messages', description: 'Messages chat', status: 'Nouveau' },
    { name: 'audit_logs', description: 'Logs d\'audit', status: 'Optionnel' },
    { name: 'tenant_documents', description: 'Documents locataires', status: 'Optionnel' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Configuré':
        return 'bg-green-100 text-green-800';
      case 'Nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'À créer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Database className="h-5 w-5 text-blue-600" />
          Collections Firebase configurées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div key={collection.name} className="p-3 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900">{collection.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{collection.description}</p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusColor(collection.status)}`}>
                {collection.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
