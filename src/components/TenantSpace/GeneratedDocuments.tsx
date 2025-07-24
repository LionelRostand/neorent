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
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { useGeneratedDocuments, GeneratedDocument } from '@/hooks/useGeneratedDocuments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { deleteTestInspectionDocuments } from '@/services/deleteTestDocumentsService';

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

  const handleDeleteTestDocuments = async () => {
    if (!userProfile?.name) return;
    
    try {
      const result = await deleteTestInspectionDocuments(userProfile.name);
      
      if (result.success) {
        toast({
          title: "Documents supprimés",
          description: `${result.deletedCount} document(s) de test supprimé(s)`,
        });
        
        // Recharger les documents
        window.location.reload();
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression des documents de test",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = async (document: GeneratedDocument) => {
    try {
      console.log('📖 Ouverture du document:', document);
      
      // Créer le contenu HTML du document
      const htmlContent = generateDocumentHTML(document);
      
      // Ouvrir dans une nouvelle fenêtre
      const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.focus();
      }
      
      toast({
        title: "Document ouvert",
        description: `${document.name} ouvert dans une nouvelle fenêtre`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async (document: GeneratedDocument) => {
    try {
      console.log('💾 Téléchargement du document:', document);
      
      // Générer le contenu PDF simulé
      const pdfContent = generatePDFContent(document);
      
      // Créer un blob et télécharger
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement commencé",
        description: `${document.name} est en cours de téléchargement`,
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive",
      });
    }
  };

  // Générer le contenu HTML pour la visualisation
  const generateDocumentHTML = (document: GeneratedDocument) => {
    const content = document.type === 'inspection_report' 
      ? generateInspectionHTML(document)
      : generateContractHTML(document);
      
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${document.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; color: #555; }
          .value { margin-left: 10px; }
          .signature-box { border: 1px solid #ccc; padding: 10px; margin: 10px 0; height: 60px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  };

  // Générer le contenu pour un rapport d'inspection
  const generateInspectionHTML = (document: GeneratedDocument) => {
    let content = `
      <div class="header">
        <h1>Rapport d'Inspection</h1>
        <p><strong>Document:</strong> ${document.name}</p>
        <p><strong>Date de création:</strong> ${new Date(document.createdDate).toLocaleDateString('fr-FR')}</p>
      </div>
      
      <div class="section">
        <h2>Informations Générales</h2>
        <p><span class="label">Propriété:</span><span class="value">${document.propertyId}</span></p>
        <p><span class="label">Locataire/Colocataire:</span><span class="value">${document.tenantId}</span></p>
        <p><span class="label">Statut:</span><span class="value">${document.status}</span></p>
      </div>
    `;

    // Ajouter les informations de base si disponibles
    if (document.content) {
      const { generalInfo, description, observations, roomsInspection, equipmentsInspection } = document.content;
      
      if (generalInfo) {
        content += `
          <div class="section">
            <h2>Détails de l'Inspection</h2>
            <p><span class="label">Titre:</span><span class="value">${generalInfo.title || ''}</span></p>
            <p><span class="label">Type:</span><span class="value">${generalInfo.type || ''}</span></p>
            <p><span class="label">Date:</span><span class="value">${generalInfo.date || ''}</span></p>
            <p><span class="label">Inspecteur:</span><span class="value">${generalInfo.inspector || ''}</span></p>
            ${generalInfo.roomNumber ? `<p><span class="label">Numéro de chambre:</span><span class="value">${generalInfo.roomNumber}</span></p>` : ''}
          </div>
        `;
      }

      if (description) {
        content += `
          <div class="section">
            <h2>Description</h2>
            <p>${description}</p>
          </div>
        `;
      }

      if (observations) {
        content += `
          <div class="section">
            <h2>Observations</h2>
            <p>${observations}</p>
          </div>
        `;
      }

      // Ajouter l'état des chambres
      if (roomsInspection && Object.keys(roomsInspection).length > 0) {
        content += `
          <div class="section">
            <h2>État des Chambres</h2>
        `;
        
        Object.entries(roomsInspection).forEach(([room, data]: [string, any]) => {
          content += `
            <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
              <h3 style="color: #2563eb; margin-bottom: 10px;">${room}</h3>
              <p><span class="label">État général:</span><span class="value">${data.condition || 'Non spécifié'}</span></p>
              <p><span class="label">Propreté:</span><span class="value">${data.cleanliness || 'Non spécifié'}</span></p>
              <p><span class="label">Dommages:</span><span class="value">${data.damages || 'Aucun'}</span></p>
              ${data.notes ? `<p><span class="label">Notes:</span><span class="value">${data.notes}</span></p>` : ''}
            </div>
          `;
        });
        
        content += `</div>`;
      }

      // Ajouter l'état des équipements
      if (equipmentsInspection && Object.keys(equipmentsInspection).length > 0) {
        content += `
          <div class="section">
            <h2>État des Équipements</h2>
        `;
        
        Object.entries(equipmentsInspection).forEach(([equipment, data]: [string, any]) => {
          content += `
            <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
              <h3 style="color: #2563eb; margin-bottom: 10px;">${equipment}</h3>
              <p><span class="label">État:</span><span class="value">${data.condition || 'Non spécifié'}</span></p>
              <p><span class="label">Fonctionnel:</span><span class="value">${data.working ? 'Oui' : 'Non'}</span></p>
              ${data.notes ? `<p><span class="label">Notes:</span><span class="value">${data.notes}</span></p>` : ''}
            </div>
          `;
        });
        
        content += `</div>`;
      }
    }

    content += `
      <div class="section">
        <h2>Signatures</h2>
        <div class="signature-box">
          <p><strong>Signature du locataire/colocataire:</strong></p>
        </div>
        <div class="signature-box">
          <p><strong>Signature du propriétaire:</strong></p>
        </div>
      </div>
    `;

    return content;
  };

  // Générer le contenu pour un contrat
  const generateContractHTML = (document: GeneratedDocument) => {
    return `
      <div class="header">
        <h1>Contrat de Bail</h1>
        <p><strong>Document:</strong> ${document.name}</p>
        <p><strong>Date de création:</strong> ${new Date(document.createdDate).toLocaleDateString('fr-FR')}</p>
        ${document.signedDate ? `<p><strong>Date de signature:</strong> ${new Date(document.signedDate).toLocaleDateString('fr-FR')}</p>` : ''}
      </div>
      
      <div class="section">
        <h2>Informations du Contrat</h2>
        <p><span class="label">Propriété:</span><span class="value">${document.propertyId}</span></p>
        <p><span class="label">Locataire:</span><span class="value">${document.tenantId}</span></p>
        <p><span class="label">Statut:</span><span class="value">${document.status}</span></p>
      </div>
      
      <div class="section">
        <h2>Description</h2>
        <p>${document.description}</p>
      </div>
      
      <div class="section">
        <h2>Signatures</h2>
        <div class="signature-box">
          <p><strong>Signature du locataire:</strong></p>
        </div>
        <div class="signature-box">
          <p><strong>Signature du propriétaire:</strong></p>
        </div>
      </div>
    `;
  };

  // Générer le contenu PDF simulé
  const generatePDFContent = (document: GeneratedDocument) => {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(${document.name}) Tj
0 -20 Td
(Date: ${new Date(document.createdDate).toLocaleDateString('fr-FR')}) Tj
0 -20 Td
(${document.description}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Documents générés automatiquement
          </h3>
          <p className="text-gray-600 text-sm">
            Documents officiels créés par l'application et partagés entre toutes les parties
          </p>
        </div>
        {/* Bouton de nettoyage - visible seulement s'il y a des documents de test */}
        {documents.some(doc => doc.name.startsWith('Test_')) && (
          <Button
            onClick={handleDeleteTestDocuments}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            🗑️ Nettoyer les tests
          </Button>
        )}
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
                      onClick={() => handleViewDocument(document)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
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