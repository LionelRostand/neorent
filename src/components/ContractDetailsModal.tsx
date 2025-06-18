
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building2, 
  Calendar, 
  Euro, 
  FileText, 
  MapPin,
  Clock,
  ScrollText
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
  signedDate?: string;
}

interface ContractDetailsModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  isOpen,
  onClose
}) => {
  if (!contract) return null;

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

  const englishStatus = getStatusInEnglish(contract.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Signed':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Contract Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main information */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{contract.title}</h3>
                    <p className="text-gray-600 mt-1">{contract.type}</p>
                  </div>
                  <Badge className={getStatusColor(englishStatus)}>
                    {englishStatus}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Owner/Provider</p>
                      <p className="font-medium">{contract.provider}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tenant</p>
                      <p className="font-medium">{contract.tenant}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Property</p>
                      <p className="font-medium">{contract.property}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Euro className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium text-blue-600">{contract.amount}/month</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract duration */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Contract Duration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{new Date(contract.startDate).toLocaleDateString('en-US')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{new Date(contract.endDate).toLocaleDateString('en-US')}</p>
                  </div>
                </div>
              </div>
              {contract.signedDate && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <ScrollText className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Signing Date</p>
                      <p className="font-medium text-green-600">
                        {new Date(contract.signedDate).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legal information */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Legal Information
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Jurisdiction</p>
                <p className="font-medium">{contract.jurisdiction}</p>
              </div>
            </CardContent>
          </Card>

          {/* Signatures */}
          {contract.signatures && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-blue-600" />
                  Signatures
                </h4>
                <div className="space-y-3">
                  {contract.signatures.owner && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Owner</p>
                      <p className="text-sm text-green-600">
                        Signed by {contract.signatures.owner.signerInfo.name} 
                        on {new Date(contract.signatures.owner.signerInfo.date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  )}
                  {contract.signatures.tenant && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Tenant</p>
                      <p className="text-sm text-blue-600">
                        Signed by {contract.signatures.tenant.signerInfo.name} 
                        on {new Date(contract.signatures.tenant.signerInfo.date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDetailsModal;
