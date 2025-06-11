import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SignaturePad from './SignaturePad';
import { generateContractPDF } from '@/services/contractPdfService';
import { FileText, CheckCircle, Clock, User, Building2, Download } from 'lucide-react';

interface ContractSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
  onSigningComplete: (contractId: string, signatures: any) => void;
}

interface Signature {
  signatureDataUrl: string;
  signerInfo: {
    name: string;
    role: string;
    date: string;
  };
}

const ContractSigningModal = ({ isOpen, onClose, contract, onSigningComplete }: ContractSigningModalProps) => {
  const { toast } = useToast();
  const [signatures, setSignatures] = useState<{
    owner?: Signature;
    tenant?: Signature;
  }>({});

  if (!contract) return null;

  const handleSignatureComplete = (role: 'owner' | 'tenant', signatureDataUrl: string, signerInfo: any) => {
    const newSignatures = {
      ...signatures,
      [role]: {
        signatureDataUrl,
        signerInfo
      }
    };
    
    setSignatures(newSignatures);
    
    toast({
      title: "Signature enregistrée",
      description: `La signature de ${signerInfo.name} a été enregistrée.`,
    });

    // Vérifier si toutes les signatures sont complètes
    if (newSignatures.owner && newSignatures.tenant) {
      // Validation de l'ID du contrat avant de procéder
      if (!contract.id || typeof contract.id !== 'string') {
        console.error('Contract ID is invalid:', contract.id);
        toast({
          title: "Erreur",
          description: "Erreur: ID du contrat invalide",
          variant: "destructive",
        });
        return;
      }

      console.log('Contract being signed:', contract);
      onSigningComplete(contract.id, newSignatures);
      toast({
        title: "Contrat signé",
        description: "Le contrat a été signé par toutes les parties.",
      });
    }
  };

  const handleDownloadContract = () => {
    const contractData = {
      title: contract.title,
      type: contract.type,
      tenant: contract.tenant,
      property: contract.property,
      startDate: contract.startDate,
      endDate: contract.endDate,
      amount: contract.amount,
      jurisdiction: contract.jurisdiction,
      signatures: signatures
    };
    
    generateContractPDF(contractData);
    
    toast({
      title: "Contrat téléchargé",
      description: "Le contrat de bail a été téléchargé en PDF.",
    });
  };

  const isFullySigned = signatures.owner && signatures.tenant;
  const ownerSigned = !!signatures.owner;
  const tenantSigned = !!signatures.tenant;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Signature du contrat de bail
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du contrat */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Détails du contrat</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{contract.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{contract.tenant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{contract.property}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Montant:</span>
                  <span>{contract.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Juridiction:</span>
                  <span>{contract.jurisdiction === 'francaise' ? 'Française' : 'Camerounaise'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* État des signatures */}
          <Card>
            <CardHeader>
              <CardTitle>État des signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ownerSigned ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {ownerSigned ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Propriétaire</p>
                    <Badge variant={ownerSigned ? "default" : "secondary"}>
                      {ownerSigned ? 'Signé' : 'En attente'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tenantSigned ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {tenantSigned ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Locataire</p>
                    <Badge variant={tenantSigned ? "default" : "secondary"}>
                      {tenantSigned ? 'Signé' : 'En attente'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFullySigned ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {isFullySigned ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Contrat</p>
                    <Badge variant={isFullySigned ? "default" : "secondary"}>
                      {isFullySigned ? 'Complet' : 'En cours'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zones de signature */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SignaturePad
              onSignatureComplete={(signatureDataUrl, signerInfo) => 
                handleSignatureComplete('owner', signatureDataUrl, signerInfo)
              }
              signerName="Propriétaire / Bailleur"
              signerRole="Propriétaire"
              isReadOnly={ownerSigned}
              existingSignature={signatures.owner?.signatureDataUrl}
            />

            <SignaturePad
              onSignatureComplete={(signatureDataUrl, signerInfo) => 
                handleSignatureComplete('tenant', signatureDataUrl, signerInfo)
              }
              signerName={contract.tenant}
              signerRole={contract.tenant.includes('Colocataire') ? 'Colocataire' : 'Locataire'}
              isReadOnly={tenantSigned}
              existingSignature={signatures.tenant?.signatureDataUrl}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleDownloadContract}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger PDF
              </Button>
              
              {isFullySigned && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleDownloadContract}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Contrat signé complet
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractSigningModal;
