
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Calendar, ClipboardList, MapPin, FileText } from 'lucide-react';

interface InspectionDetails {
  id: number;
  title: string;
  type: string;
  tenant: string;
  property: string;
  roomNumber?: string;
  date: string;
  inspector: string;
  status: string;
  contractType?: string;
  description?: string;
  observations?: string;
}

interface InspectionDetailsModalProps {
  inspection: InspectionDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const InspectionDetailsModal = ({ inspection, isOpen, onClose }: InspectionDetailsModalProps) => {
  const handleGeneratePDF = () => {
    if (!inspection) return;

    // Simuler la génération du PDF
    const pdfDocument = {
      id: Date.now(),
      name: `Etat_lieux_${inspection.type}_${inspection.tenant.split(' ')[0]}.pdf`,
      type: 'etat_lieux',
      uploadDate: new Date().toISOString(),
      inspectionId: inspection.id
    };

    console.log('Document PDF généré et stocké dans le profil:', pdfDocument);
    console.log(`PDF stocké sur le profil de ${inspection.tenant} - Onglet Documents`);
    
    // Ici on pourrait déclencher un toast de succès
    alert(`PDF généré avec succès et stocké dans le profil de ${inspection.tenant}`);
  };

  if (!inspection) return null;

  const isColocatif = inspection.contractType === 'Bail colocatif' || inspection.tenant.includes('Colocataire');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Détails de l'État des Lieux</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{inspection.title}</h3>
                  <p className="text-gray-600">{inspection.type}</p>
                </div>
                <Badge 
                  variant={inspection.status === 'Terminé' ? 'default' : inspection.status === 'En cours' ? 'secondary' : 'outline'}
                  className={
                    inspection.status === 'Terminé' ? 'bg-green-100 text-green-800' : 
                    inspection.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {inspection.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Date: {new Date(inspection.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  <span>Inspecteur: {inspection.inspector}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du bien */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails du Bien Immobilier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center text-gray-600">
                  <Building2 className="mr-2 h-4 w-4" />
                  <div>
                    <span className="font-medium">Propriété: </span>
                    <span>{inspection.property}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  <div>
                    <span className="font-medium">
                      {isColocatif ? 'Colocataire: ' : 'Locataire: '}
                    </span>
                    <span>{inspection.tenant}</span>
                  </div>
                </div>

                {isColocatif && inspection.roomNumber && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <div>
                      <span className="font-medium">Chambre: </span>
                      <span>{inspection.roomNumber}</span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type de contrat: </span>
                    {isColocatif ? 'Bail colocatif' : 'Bail locatif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description et observations */}
          {(inspection.description || inspection.observations) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Détails de l'Inspection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inspection.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                      {inspection.description}
                    </p>
                  </div>
                )}
                {inspection.observations && (
                  <div>
                    <h4 className="font-medium mb-2">Observations</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                      {inspection.observations}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                Modifier l'état des lieux
              </Button>
              <Button onClick={handleGeneratePDF} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Générer PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDetailsModal;
