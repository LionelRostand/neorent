
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  Shield,
  ClipboardList,
  User,
  CreditCard,
  Home,
  Download,
  Eye
} from 'lucide-react';

interface DocumentType {
  key: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  required: boolean;
}

interface Document {
  exists: boolean;
  name: string | null;
  uploadDate: string | null;
  status: string;
}

interface TenantDocumentsTabProps {
  onViewDocument: (documentName: string, documentType: string) => void;
  onDownloadDocument: (documentName: string) => void;
}

const TenantDocumentsTab: React.FC<TenantDocumentsTabProps> = ({
  onViewDocument,
  onDownloadDocument
}) => {
  // Simuler les documents étendus
  const documents: Record<string, Document> = {
    bail: { exists: true, name: 'Contrat de bail - Marie Dubois.pdf', uploadDate: '2023-06-01', status: 'Signé' },
    assurance: { exists: true, name: 'Assurance habitation.pdf', uploadDate: '2023-05-28', status: 'Valide' },
    etatLieuxEntree: { exists: true, name: 'État des lieux entrée.pdf', uploadDate: '2023-06-01', status: 'Signé' },
    revenus: { exists: true, name: 'Bulletins de salaire.pdf', uploadDate: '2023-05-25', status: 'Validé' },
    identite: { exists: true, name: 'Carte identité.pdf', uploadDate: '2023-05-20', status: 'Validé' },
    rib: { exists: true, name: 'RIB.pdf', uploadDate: '2023-05-20', status: 'Validé' },
    garant: { exists: false, name: null, uploadDate: null, status: 'Non requis' },
    taxeHabitation: { exists: false, name: null, uploadDate: null, status: 'Optionnel' },
    etatLieuxSortie: { exists: false, name: null, uploadDate: null, status: 'À venir' }
  };

  const documentTypes: DocumentType[] = [
    { key: 'bail', icon: FileText, label: 'Contrat de bail', color: 'text-blue-600', required: true },
    { key: 'assurance', icon: Shield, label: 'Assurance habitation', color: 'text-green-600', required: true },
    { key: 'etatLieuxEntree', icon: ClipboardList, label: 'État des lieux d\'entrée', color: 'text-purple-600', required: true },
    { key: 'revenus', icon: CreditCard, label: 'Justificatifs de revenus', color: 'text-orange-600', required: true },
    { key: 'identite', icon: User, label: 'Pièce d\'identité', color: 'text-red-600', required: true },
    { key: 'rib', icon: CreditCard, label: 'RIB', color: 'text-teal-600', required: true },
    { key: 'garant', icon: User, label: 'Documents garant', color: 'text-indigo-600', required: false },
    { key: 'taxeHabitation', icon: Home, label: 'Taxe d\'habitation', color: 'text-gray-600', required: false },
    { key: 'etatLieuxSortie', icon: ClipboardList, label: 'État des lieux de sortie', color: 'text-orange-600', required: false }
  ];

  const getDocumentStatusBadge = (status: string, exists: boolean, required: boolean) => {
    if (exists) {
      switch (status) {
        case 'Signé':
        case 'Valide':
        case 'Validé':
          return <Badge className="bg-green-100 text-green-800">✓ {status}</Badge>;
        default:
          return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      }
    } else {
      if (required) {
        return <Badge className="bg-red-100 text-red-800">❌ Manquant</Badge>;
      } else {
        return <Badge variant="secondary">{status}</Badge>;
      }
    }
  };

  return (
    <div className="grid gap-4">
      {documentTypes.map((docType) => {
        const document = documents[docType.key];
        const Icon = docType.icon;
        
        return (
          <Card key={docType.key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-8 w-8 ${docType.color}`} />
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {docType.label}
                      {docType.required && <Badge variant="outline" className="text-xs">Requis</Badge>}
                    </h4>
                    {document.exists ? (
                      <p className="text-sm text-gray-600">
                        {document.name} • Ajouté le {new Date(document.uploadDate!).toLocaleDateString('fr-FR')}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Aucun document uploadé</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getDocumentStatusBadge(document.status, document.exists, docType.required)}
                  {document.exists && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewDocument(document.name!, docType.label)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDownloadDocument(document.name!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TenantDocumentsTab;
