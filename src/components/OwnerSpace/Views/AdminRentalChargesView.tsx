
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Calculator, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useAuth } from '@/hooks/useAuth';
import RentalChargeForm from '@/components/RentalChargeForm';

interface AdminRentalChargesViewProps {
  currentProfile: any;
}

const AdminRentalChargesView: React.FC<AdminRentalChargesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { charges } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const [showChargeForm, setShowChargeForm] = useState(false);

  const totalCharges = charges.length;
  const monthlyCharges = charges.filter(c => c.month).length;
  const annualCharges = charges.filter(c => !c.month).length;
  const totalAmount = charges.reduce((sum, c) => sum + (c.total || 0), 0);

  const handleChargeSubmit = async (chargeData: any) => {
    console.log('Charge data:', chargeData);
    setShowChargeForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Charges Locatives</h1>
            <p className="text-gray-600 mt-1">Gérez vos charges et provisions</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowChargeForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle charge
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Charges</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCharges}</div>
              <p className="text-xs text-muted-foreground">{totalCharges} charges enregistrées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Charges Mensuelles</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyCharges}</div>
              <p className="text-xs text-muted-foreground">{monthlyCharges} charges récurrentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Charges Annuelles</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{annualCharges}</div>
              <p className="text-xs text-muted-foreground">{annualCharges} charges ponctuelles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAmount}€</div>
              <p className="text-xs text-muted-foreground">Charges totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Charges List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Charges</CardTitle>
          </CardHeader>
          <CardContent>
            {charges.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune charge trouvée</p>
                <p className="text-sm text-gray-400">Commencez par ajouter vos premières charges</p>
              </div>
            ) : (
              <div className="space-y-4">
                {charges.map((charge) => (
                  <div key={charge.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Calculator className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Charges {charge.month}</h3>
                        <p className="text-sm text-gray-600">{charge.propertyName}</p>
                        <p className="text-sm text-gray-500">Locataire: {charge.tenant}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{charge.total}€</p>
                      <Badge variant="secondary">{charge.month ? 'Mensuel' : 'Annuel'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showChargeForm} onOpenChange={setShowChargeForm}>
          <RentalChargeForm 
            onClose={() => setShowChargeForm(false)}
            onSubmit={handleChargeSubmit}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default AdminRentalChargesView;
