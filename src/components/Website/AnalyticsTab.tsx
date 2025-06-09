
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, Phone, Mail } from 'lucide-react';

const AnalyticsTab = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📊 Analytics</h2>
      <p className="text-gray-600 text-sm md:text-base">
        Statistiques de visite avec tracking des interactions et données stockées dans website_analytics.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg md:text-2xl font-bold">147</p>
                <p className="text-xs md:text-sm text-gray-600">Visiteurs aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Eye className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg md:text-2xl font-bold">1,234</p>
                <p className="text-xs md:text-sm text-gray-600">Pages vues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg md:text-2xl font-bold">23</p>
                <p className="text-xs md:text-sm text-gray-600">Appels téléphone</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Mail className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg md:text-2xl font-bold">12</p>
                <p className="text-xs md:text-sm text-gray-600">Demandes contact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Évolution hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm md:text-base text-center px-4">
              Graphique des visites (à intégrer avec Recharts)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
