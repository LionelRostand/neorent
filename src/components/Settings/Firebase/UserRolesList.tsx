
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UserRolesList: React.FC = () => {
  const roles = [
    {
      role: 'admin',
      description: 'Accès complet à toutes les fonctionnalités',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      descColor: 'text-red-700'
    },
    {
      role: 'manager',
      description: 'Gestion des biens, locataires, contrats et paiements',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      descColor: 'text-blue-700'
    },
    {
      role: 'inspector',
      description: 'Création et modification des états des lieux uniquement',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      descColor: 'text-green-700'
    },
    {
      role: 'tenant',
      description: 'Accès limité à ses propres informations',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      descColor: 'text-gray-700'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          👥 Rôles utilisateurs définis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {roles.map((roleItem) => (
            <div key={roleItem.role} className={`p-3 ${roleItem.bgColor} border ${roleItem.borderColor} rounded-lg`}>
              <h4 className={`font-medium ${roleItem.textColor}`}>{roleItem.role}</h4>
              <p className={`text-sm ${roleItem.descColor}`}>
                {roleItem.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
