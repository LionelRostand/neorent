
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ModalActionsProps {
  inspection: {
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
  };
  onClose: () => void;
  onEdit: () => void;
}

const ModalActions = ({ inspection, onClose, onEdit }: ModalActionsProps) => {
  const { t } = useTranslation();

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

  return (
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
          onClick={onEdit}
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
  );
};

export default ModalActions;
