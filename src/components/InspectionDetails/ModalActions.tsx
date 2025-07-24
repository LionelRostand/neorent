
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { saveInspectionPDFToSpaces } from '@/services/inspectionPdfService';
import { useToast } from '@/hooks/use-toast';

interface ModalActionsProps {
  inspection: {
    id: string;
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
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    if (!inspection) return;

    try {
      console.log('Starting PDF generation for inspection:', inspection);

      // Générer les données du PDF
      const pdfDocument = {
        id: Date.now().toString(),
        name: `Inspection_${inspection.type}_${inspection.tenant?.replace(/\s+/g, '_') || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`,
        type: 'inspection_report',
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

      console.log('PDF document data prepared:', pdfDocument);

      // Sauvegarder le PDF dans les espaces locataire et propriétaire
      await saveInspectionPDFToSpaces(pdfDocument);

      // Afficher la notification de succès
      toast({
        title: "PDF généré avec succès",
        description: `Le rapport d'inspection est maintenant disponible dans l'espace du locataire "${inspection.tenant}".`,
        duration: 5000,
      });

      console.log('PDF document generated and saved successfully');
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    }
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
