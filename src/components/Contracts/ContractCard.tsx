
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Calendar, FileText, Eye, Trash2 } from 'lucide-react';

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
}

interface ContractCardProps {
  contract: Contract;
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
  onViewDetails: (contract: Contract) => void;
  onSign: (contract: Contract) => void;
}

const ContractCard = ({ contract, onEdit, onDelete, onViewDetails, onSign }: ContractCardProps) => {
  const { t } = useTranslation();

  // Translate status to English
  const getStatusInEnglish = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'Active';
      case 'Signé':
        return 'Signed';
      case 'Expiré':
        return 'Expired';
      case 'Brouillon':
      case 'Draft':
        return 'Draft';
      default:
        return status;
    }
  };

  // Translate contract type to English
  const getTypeInEnglish = (type: string) => {
    switch (type) {
      case 'Colocation':
        return 'Shared Housing';
      case 'Location':
        return 'Rental';
      case 'Bail':
        return 'Lease';
      default:
        return type;
    }
  };

  // Translate contract title
  const getTranslatedTitle = (title: string) => {
    if (title.startsWith('CONTRAT DE BAIL')) {
      return title.replace('CONTRAT DE BAIL', t('contracts.leaseContract'));
    }
    return title;
  };

  const englishStatus = getStatusInEnglish(contract.status);
  const englishType = getTypeInEnglish(contract.type);
  const translatedTitle = getTranslatedTitle(contract.title);

  const handleDeleteClick = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      onDelete(contract.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {translatedTitle}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{englishType}</p>
            </div>
            <Badge 
              variant={englishStatus === 'Active' ? 'default' : englishStatus === 'Signed' ? 'default' : 'destructive'}
              className={
                englishStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                englishStatus === 'Signed' ? 'bg-blue-100 text-blue-800' : ''
              }
            >
              {englishStatus}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 text-sm">
              <User className="mr-2 h-4 w-4" />
              {contract.provider}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Building2 className="mr-2 h-4 w-4" />
              {contract.property}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <User className="mr-2 h-4 w-4" />
              {contract.tenant}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              From {new Date(contract.startDate).toLocaleDateString('en-US')} to {new Date(contract.endDate).toLocaleDateString('en-US')}
            </div>
            <div className="flex items-center text-blue-600 font-semibold text-sm">
              <FileText className="mr-2 h-4 w-4" />
              {contract.amount}/month
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Jurisdiction {contract.jurisdiction}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(contract)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir détails
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractCard;
