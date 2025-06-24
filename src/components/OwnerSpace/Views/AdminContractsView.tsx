
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Calendar, AlertTriangle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminContractsViewProps {
  currentProfile: any;
}

const AdminContractsView: React.FC<AdminContractsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { contracts } = useOwnerData(currentProfile);

  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === 'Actif').length;
  const expiringContracts = contracts.filter(c => {
    if (!c.endDate) return false;
    const endDate = new Date(c.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contrats de Bail</h1>
            <p className="text-gray-600 mt-1">Gérez vos contrats de location</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contrat
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContracts}</div>
              <p className="text-xs text-muted-foreground">{totalContracts} contrats enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeContracts}</div>
              <p className="text-xs text-muted-foreground">{activeContracts} contrats en cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expire Bientôt</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringContracts}</div>
              <p className="text-xs text-muted-foreground">{expiringContracts} dans les 30 jours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Contractuels</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contracts.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)}€
              </div>
              <p className="text-xs text-muted-foreground">Revenus mensuels totaux</p>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Contrats</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun contrat trouvé</p>
                <p className="text-sm text-gray-400">Commencez par ajouter votre premier contrat</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contract.tenant}</h3>
                        <p className="text-sm text-gray-600">{contract.property}</p>
                        <p className="text-sm text-gray-500">
                          Du {contract.startDate} au {contract.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{contract.amount}€/mois</p>
                      <Badge variant={contract.status === 'Actif' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContractsView;
