
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';

const TenantDocuments = () => {
  const isMobile = useIsMobile();
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Contrat de bail',
      type: 'bail',
      date: '2023-06-01',
      status: 'Signé',
      size: '2.4 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'État des lieux d\'entrée',
      type: 'etat_lieux_entree',
      date: '2023-06-01',
      status: 'Signé',
      size: '1.8 MB',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Assurance habitation',
      type: 'assurance',
      date: '2023-06-15',
      status: 'Valide',
      expiryDate: '2024-06-15',
      size: '956 KB',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'État des lieux de sortie',
      type: 'etat_lieux_sortie',
      date: null,
      status: 'À venir',
      size: null,
      downloadUrl: null
    }
  ]);

  const handleFileUpload = (type: string) => {
    console.log('Upload de fichier pour:', type);
    // Logique d'upload à implémenter
  };

  const getStatusBadge = (status: string) => {
    const className = `text-xs ${isMobile ? 'px-2 py-1' : ''}`;
    switch (status) {
      case 'Signé':
      case 'Valide':
        return <Badge className={`bg-green-100 text-green-800 ${className}`}>✓ {status}</Badge>;
      case 'En attente':
        return <Badge className={`bg-yellow-100 text-yellow-800 ${className}`}>⏳ {status}</Badge>;
      case 'À venir':
        return <Badge variant="secondary" className={className}>📅 {status}</Badge>;
      case 'Expiré':
        return <Badge variant="destructive" className={className}>⚠️ {status}</Badge>;
      default:
        return <Badge variant="secondary" className={className}>{status}</Badge>;
    }
  };

  const getDocumentIcon = (type: string) => {
    const iconSize = isMobile ? "h-6 w-6" : "h-8 w-8";
    switch (type) {
      case 'bail':
        return <FileText className={`${iconSize} text-blue-500`} />;
      case 'assurance':
        return <Shield className={`${iconSize} text-green-500`} />;
      case 'etat_lieux_entree':
      case 'etat_lieux_sortie':
        return <CheckCircle className={`${iconSize} text-purple-500`} />;
      default:
        return <FileText className={`${iconSize} text-gray-500`} />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Documents contractuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
            Documents contractuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4">
            {documents.filter(doc => ['bail', 'etat_lieux_entree', 'etat_lieux_sortie'].includes(doc.type)).map((document) => (
              <div key={document.id} className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} p-3 md:p-4 border rounded-lg hover:bg-gray-50`}>
                <div className="flex items-center space-x-3 md:space-x-4">
                  {getDocumentIcon(document.type)}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm md:text-base">{document.name}</h3>
                    <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'items-center gap-4'} text-xs md:text-sm text-gray-600 mt-1`}>
                      {document.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          {new Date(document.date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {document.size && <span>{document.size}</span>}
                    </div>
                  </div>
                </div>
                <div className={`flex ${isMobile ? 'justify-between items-center' : 'items-center space-x-3'}`}>
                  {getStatusBadge(document.status)}
                  {document.downloadUrl ? (
                    <div className={`flex ${isMobile ? 'space-x-2' : 'gap-2'}`}>
                      <Button variant="outline" size="sm" className={isMobile ? 'text-xs px-2' : ''}>
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className={isMobile ? 'text-xs px-2' : ''}>
                        <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" disabled className={isMobile ? 'text-xs px-2' : ''}>
                      Non disponible
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Shield className="h-4 w-4 md:h-5 md:w-5" />
            Assurance habitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.filter(doc => doc.type === 'assurance').map((document) => (
              <div key={document.id} className="space-y-4">
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} p-3 md:p-4 border rounded-lg hover:bg-gray-50`}>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    {getDocumentIcon(document.type)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm md:text-base">{document.name}</h3>
                      <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'items-center gap-4'} text-xs md:text-sm text-gray-600 mt-1`}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          Expire le {new Date(document.expiryDate!).toLocaleDateString('fr-FR')}
                        </span>
                        <span>{document.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex ${isMobile ? 'justify-between items-center' : 'items-center space-x-3'}`}>
                    {getStatusBadge(document.status)}
                    <div className={`flex ${isMobile ? 'space-x-2' : 'gap-2'}`}>
                      <Button variant="outline" size="sm" className={isMobile ? 'text-xs px-2' : ''}>
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className={isMobile ? 'text-xs px-2' : ''}>
                        <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Section de mise à jour de l'assurance */}
                <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm md:text-base">Mettre à jour votre assurance</h4>
                  <p className="text-xs md:text-sm text-blue-700 mb-3">
                    Votre assurance expire le {new Date(document.expiryDate!).toLocaleDateString('fr-FR')}. 
                    Pensez à télécharger votre nouvelle attestation.
                  </p>
                  <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center gap-3'}`}>
                    <Input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      className={`${isMobile ? 'text-xs' : 'flex-1'}`} 
                    />
                    <Button 
                      onClick={() => handleFileUpload('assurance')}
                      className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'w-full text-xs' : ''}`}
                      size={isMobile ? "sm" : "default"}
                    >
                      <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations importantes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 text-lg md:text-xl">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
            Informations importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <ul className="space-y-2 text-xs md:text-sm">
            <li>• L'assurance habitation doit être maintenue pendant toute la durée du bail</li>
            <li>• Toute modification de votre situation doit être signalée au propriétaire</li>
            <li>• Les documents peuvent être consultés et téléchargés à tout moment</li>
            <li>• En cas de problème, contactez votre gestionnaire immobilier</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDocuments;
