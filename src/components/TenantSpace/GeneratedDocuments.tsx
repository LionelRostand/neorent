import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  CheckCircle,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useGeneratedDocuments, GeneratedDocument } from '@/hooks/useGeneratedDocuments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const GeneratedDocuments: React.FC = () => {
  const { t } = useTranslation();
  const { user, userType, userProfile } = useAuth();
  const { toast } = useToast();
  
  const { 
    documents, 
    loading, 
    downloadDocument 
  } = useGeneratedDocuments(
    userProfile?.id || user?.uid, 
    userType,
    userProfile
  );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return FileText;
      case 'entry_inspection':
        return FileCheck;
      case 'exit_inspection':
        return AlertCircle;
      case 'inspection_report':
        return FileCheck;
      default:
        return FileText;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'contract':
        return 'text-blue-600 bg-blue-100';
      case 'entry_inspection':
        return 'text-green-600 bg-green-100';
      case 'exit_inspection':
        return 'text-orange-600 bg-orange-100';
      case 'inspection_report':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'contract':
        return 'Contrat';
      case 'entry_inspection':
        return 'État des lieux d\'entrée';
      case 'exit_inspection':
        return 'État des lieux de sortie';
      case 'inspection_report':
        return 'Rapport d\'inspection';
      default:
        return 'Document';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Signé
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complété
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="border-yellow-200 text-yellow-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Brouillon
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const handleDownload = async (document: GeneratedDocument) => {
    try {
      await downloadDocument(document);
      toast({
        title: "Téléchargement",
        description: `${document.name} téléchargé avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du document",
        variant: "destructive",
      });
    }
  };

  const handleView = (document: GeneratedDocument) => {
    // Simuler la visualisation du document
    toast({
      title: "Visualisation",
      description: `Ouverture de ${document.name}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Chargement des documents générés...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-600">
                Aucun document généré
              </h3>
              <p className="text-gray-500 max-w-md">
                Les documents générés automatiquement (contrats, états des lieux) 
                apparaîtront ici une fois créés et signés.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Documents générés automatiquement
        </h3>
        <p className="text-gray-600 text-sm">
          Documents officiels créés par l'application et partagés entre toutes les parties
        </p>
      </div>

      <div className="grid gap-4">
        {documents.map((document) => {
          const IconComponent = getDocumentIcon(document.type);
          const colorClass = getDocumentTypeColor(document.type);
          
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {document.name}
                        </h4>
                        {getStatusBadge(document.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {document.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Créé le {new Date(document.createdDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {document.signedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>
                              Signé le {new Date(document.signedDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(document)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GeneratedDocuments;