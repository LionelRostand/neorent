
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Upload, Eye, Calendar, Shield, ClipboardList } from 'lucide-react';

const TenantDocuments = () => {
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  
  const documents = [
    {
      id: 1,
      name: 'Contrat de bail',
      type: 'lease',
      status: 'Disponible',
      date: '2023-06-01',
      file: 'bail_marie_dubois.pdf',
      icon: FileText
    },
    {
      id: 2,
      name: 'Assurance habitation',
      type: 'insurance',
      status: 'Téléchargé',
      date: '2024-01-15',
      file: 'assurance_2024.pdf',
      icon: Shield
    },
    {
      id: 3,
      name: 'État des lieux d\'entrée',
      type: 'inventory_in',
      status: 'Disponible',
      date: '2023-06-01',
      file: 'etat_lieux_entree.pdf',
      icon: ClipboardList
    },
    {
      id: 4,
      name: 'État des lieux de sortie',
      type: 'inventory_out',
      status: 'Non disponible',
      date: null,
      file: null,
      icon: ClipboardList
    }
  ];

  const handleFileUpload = (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Téléchargement de ${file.name} pour ${docType}`);
      setUploadingDoc(docType);
      // Simulation d'upload
      setTimeout(() => {
        setUploadingDoc(null);
      }, 2000);
    }
  };

  const handleDownload = (fileName: string) => {
    console.log(`Téléchargement du fichier: ${fileName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Téléchargé':
        return 'bg-blue-100 text-blue-800';
      case 'Non disponible':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mes Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const Icon = doc.icon;
              return (
                <Card key={doc.id} className="border-2 hover:border-blue-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.name}</h3>
                          {doc.date && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(doc.date).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      {doc.status === 'Disponible' && doc.file && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownload(doc.file!)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleDownload(doc.file!)}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        </>
                      )}
                      
                      {doc.type === 'insurance' && (
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(doc.type, e)}
                            className="hidden"
                            id={`upload-${doc.type}`}
                            disabled={uploadingDoc === doc.type}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById(`upload-${doc.type}`)?.click()}
                            disabled={uploadingDoc === doc.type}
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {uploadingDoc === doc.type ? 'Envoi...' : 'Mettre à jour'}
                          </Button>
                        </div>
                      )}
                      
                      {doc.status === 'Téléchargé' && (
                        <Button 
                          size="sm"
                          onClick={() => handleDownload(doc.file!)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                      
                      {doc.status === 'Non disponible' && (
                        <Button size="sm" variant="outline" disabled className="flex-1">
                          Document non disponible
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDocuments;
