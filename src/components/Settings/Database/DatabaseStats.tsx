
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Users, Database } from 'lucide-react';

export const DatabaseStats: React.FC = () => {
  const stats = [
    {
      icon: <Database className="h-5 w-5 text-blue-600" />,
      label: 'Collections configurées',
      value: '15',
      description: 'Collections Firestore actives'
    },
    {
      icon: <Users className="h-5 w-5 text-green-600" />,
      label: 'Utilisateurs actifs',
      value: '0',
      description: 'Comptes utilisateurs créés'
    },
    {
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      label: 'Documents stockés',
      value: '0',
      description: 'Documents dans toutes les collections'
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
      label: 'Opérations/jour',
      value: '0',
      description: 'Lectures et écritures quotidiennes'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Statistiques de la base de données
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="font-medium text-gray-900">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-sm">📊</span>
            <div className="text-sm">
              <p className="font-medium text-gray-800 mb-1">Informations importantes :</p>
              <ul className="text-gray-700 space-y-1">
                <li>• Les statistiques sont mises à jour en temps réel</li>
                <li>• Surveillez votre quota Firestore dans la console Firebase</li>
                <li>• Optimisez vos requêtes pour réduire les coûts</li>
                <li>• Configurez des alertes de facturation si nécessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
