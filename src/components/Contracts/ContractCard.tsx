
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Calendar, FileText, Edit, Trash2 } from 'lucide-react';

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

  const englishStatus = getStatusInEnglish(contract.status);
  const englishType = getTypeInEnglish(contract.type);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {t('contracts.leaseContract')} - {contract.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{englishType}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={englishStatus === 'Active' ? 'default' : englishStatus === 'Signed' ? 'default' : 'destructive'}
                className={
                  englishStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                  englishStatus === 'Signed' ? 'bg-blue-100 text-blue-800' : ''
                }
              >
                {englishStatus}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(contract)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(contract.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
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
          
          <div className="flex space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails(contract)}
            >
              {t('contracts.viewDetails')}
            </Button>
            {englishStatus !== 'Signed' ? (
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="sm"
                onClick={() => onSign(contract)}
              >
                {t('contracts.signContract')}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onEdit(contract)}
              >
                {t('contracts.editContract')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractCard;
