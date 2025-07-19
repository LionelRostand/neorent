
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  PenTool,
  Calendar,
  Euro,
  User,
  Building2
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  type: string;
  provider: string;
  property: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
  tenant: string;
  jurisdiction: string;
  signatures?: any;
}

interface ContractsListProps {
  contracts: Contract[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
  onViewDetails: (contract: Contract) => void;
  onSign: (contract: Contract) => void;
}

const ContractsList: React.FC<ContractsListProps> = ({
  contracts,
  onEdit,
  onDelete,
  onViewDetails,
  onSign
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Signé':
        return 'bg-blue-100 text-blue-800';
      case 'Expiré':
        return 'bg-red-100 text-red-800';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canSign = (contract: Contract) => {
    return contract.status !== 'Signé' && (!contract.signatures || !contract.signatures.owner || !contract.signatures.tenant);
  };

  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No contracts found</h3>
        <p className="text-gray-500 mb-4">Start by creating your first contract</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {contracts.map((contract) => (
        <Card key={contract.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg text-gray-900">{contract.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-1" />
                  {contract.type}
                </div>
              </div>
              <Badge className={getStatusColor(contract.status)}>
                {contract.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Propriétaire:</span>
                <span>{contract.provider}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Locataire:</span>
                <span>{contract.tenant}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Propriété:</span>
                <span>{contract.property}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Euro className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Montant:</span>
                <span className="font-semibold text-blue-600">{contract.amount}€/mois</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Du {new Date(contract.startDate).toLocaleDateString('fr-FR')} au {new Date(contract.endDate).toLocaleDateString('fr-FR')}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(contract)}
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-1" />
                Détails
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(contract)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              
              {canSign(contract) && (
                <Button
                  size="sm"
                  onClick={() => onSign(contract)}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  <PenTool className="h-4 w-4 mr-1" />
                  Signer
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(contract.id)}
                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContractsList;
