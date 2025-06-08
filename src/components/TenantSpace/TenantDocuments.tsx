
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    switch (status) {
      case 'Signé':
      case 'Valide':
        return <Badge className="bg-green-100 text-green-800">✓ {status}</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ {status}</Badge>;
      case 'À venir':
        return <Badge variant="secondary">📅 {status}</Badge>;
      case 'Expiré':
        return <Badge variant="destructive">⚠️ {status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'bail':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'assurance':
        return <Shield className="h-8 w-8 text-green-500" />;
      case 'etat_lieux_entree':
      case 'etat_lieux_sortie':
        return <CheckCircle className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Documents contractuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents contractuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {documents.filter(doc => ['bail', 'etat_lieux_entree', 'etat_lieux_sortie'].includes(doc.type)).map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {getDocumentIcon(document.type)}
                  <div>
                    <h3 className="font-medium">{document.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      {document.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(document.date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {document.size && <span>{document.size}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(document.status)}
                  {document.downloadUrl ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
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
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assurance habitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.filter(doc => doc.type === 'assurance').map((document) => (
              <div key={document.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getDocumentIcon(document.type)}
                    <div>
                      <h3 className="font-medium">{document.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Expire le {new Date(document.expiryDate!).toLocaleDateString('fr-FR')}
                        </span>
                        <span>{document.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(document.status)}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Section de mise à jour de l'assurance */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Mettre à jour votre assurance</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Votre assurance expire le {new Date(document.expiryDate!).toLocaleDateString('fr-FR')}. 
                    Pensez à télécharger votre nouvelle attestation.
                  </p>
                  <div className="flex items-center gap-3">
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="flex-1" />
                    <Button 
                      onClick={() => handleFileUpload('assurance')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
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
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            Informations importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <ul className="space-y-2 text-sm">
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
