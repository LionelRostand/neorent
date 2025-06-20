
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Calendar, ClipboardList, MapPin, FileText } from 'lucide-react';
import InspectionEditForm from './InspectionEditForm';

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
  onUpdate?: (inspection: InspectionDetails) => void;
}

const InspectionDetailsModal = ({ inspection, isOpen, onClose, onUpdate }: InspectionDetailsModalProps) => {
  const { t } = useTranslation();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleGeneratePDF = () => {
    if (!inspection) return;

    // Générer le PDF avec toutes les informations de l'état des lieux
    const pdfDocument = {
      id: Date.now(),
      name: `Etat_lieux_${inspection.type}_${inspection.tenant?.replace(/\s+/g, '_') || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`,
      type: 'etat_lieux',
      uploadDate: new Date().toISOString(),
      inspectionId: inspection.id,
      tenantName: inspection.tenant,
      propertyName: inspection.property,
      roomNumber: inspection.roomNumber,
      contractType: inspection.contractType,
      content: {
        generalInfo: {
          title: inspection.title,
          type: inspection.type,
          date: inspection.date,
          inspector: inspection.inspector,
          property: inspection.property,
          tenant: inspection.tenant,
          roomNumber: inspection.roomNumber
        },
        description: inspection.description,
        observations: inspection.observations,
        status: inspection.status
      }
    };

    console.log('Document PDF généré avec contenu complet:', pdfDocument);
    console.log(`PDF stocké dans le profil de ${inspection.tenant} - Onglet Documents`);
    
    // Simulation de l'envoi vers l'API backend
    console.log('Envoi vers l\'API:', {
      endpoint: '/api/documents/generate-pdf',
      method: 'POST',
      data: pdfDocument
    });
    
    alert(`PDF généré avec succès et stocké dans le profil de ${inspection.tenant}!\n\nNom du fichier: ${pdfDocument.name}`);
  };

  const handleEditInspection = () => {
    setIsEditFormOpen(true);
  };

  const handleSaveInspection = (updatedData: any) => {
    if (inspection && onUpdate) {
      const updatedInspection = { ...inspection, ...updatedData };
      onUpdate(updatedInspection);
      console.log('État des lieux mis à jour dans la collection rent_etat:', updatedInspection);
    }
  };

  if (!inspection) return null;

  const isColocatif = inspection.contractType === 'Bail colocatif' || (inspection.tenant && inspection.tenant.includes('Colocataire'));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] lg:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 lg:p-6">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold text-center sm:text-left pr-6 sm:pr-8">
              {t('inspections.viewDetails')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{t('inspections.generalInformation')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                      {inspection.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                      {inspection.type}
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-start sm:self-auto">
                    <Badge 
                      variant={inspection.status === 'Terminé' || inspection.status === 'Completed' ? 'default' : 
                             inspection.status === 'En cours' || inspection.status === 'In Progress' ? 'secondary' : 'outline'}
                      className={`text-xs sm:text-sm whitespace-nowrap ${
                        inspection.status === 'Terminé' || inspection.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        inspection.status === 'En cours' || inspection.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {inspection.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <Calendar className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-medium">{t('inspections.date')}: </span>
                      {new Date(inspection.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <User className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-medium">{t('inspections.inspector')}: </span>
                      {inspection.inspector}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails du bien */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{t('inspections.propertyDetails')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start text-gray-600 text-sm sm:text-base">
                    <Building2 className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">{t('inspections.property')}: </span>
                      <span className="break-words">{inspection.property}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start text-gray-600 text-sm sm:text-base">
                    <User className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">
                        {isColocatif ? `${t('inspections.roommate')}: ` : `${t('inspections.tenant')}: `}
                      </span>
                      <span className="break-words">{inspection.tenant}</span>
                    </div>
                  </div>

                  {isColocatif && inspection.roomNumber && (
                    <div className="flex items-start text-gray-600 text-sm sm:text-base">
                      <MapPin className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">{t('inspections.room')}: </span>
                        <span className="break-words">{inspection.roomNumber}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      <span className="font-medium">{t('inspections.contractType')}: </span>
                      {isColocatif ? t('inspections.colocationLease') : t('inspections.rentalLease')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description et observations */}
            {(inspection.description || inspection.observations) && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">{t('inspections.inspectionDetails')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  {inspection.description && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">{t('inspections.description')}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-md break-words leading-relaxed">
                        {inspection.description}
                      </p>
                    </div>
                  )}
                  {inspection.observations && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">{t('inspections.observations')}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-md break-words leading-relaxed">
                        {inspection.observations}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2"
              >
                {t('inspections.close')}
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={handleEditInspection}
                  className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2"
                >
                  {t('inspections.modify')}
                </Button>
                <Button 
                  onClick={handleGeneratePDF} 
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2"
                >
                  <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{t('inspections.generatePDF')}</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InspectionEditForm
        inspection={inspection}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSave={handleSaveInspection}
      />
    </>
  );
};

export default InspectionDetailsModal;
