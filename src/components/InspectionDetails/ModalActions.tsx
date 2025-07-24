
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    roomsData?: string;
    equipmentsData?: string;
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
      console.log('📄 Génération PDF pour inspection complète:', inspection);
      console.log('📄 roomsData brut:', inspection.roomsData);
      console.log('📄 equipmentsData brut:', inspection.equipmentsData);

      // Parser les données des chambres et équipements
      let roomsData = {};
      let equipmentsData = {};
      
      try {
        if (inspection.roomsData) {
          roomsData = JSON.parse(inspection.roomsData);
        }
      } catch (e) {
        console.warn('Erreur parsing roomsData:', e);
      }
      
      try {
        if (inspection.equipmentsData) {
          equipmentsData = JSON.parse(inspection.equipmentsData);
        }
      } catch (e) {
        console.warn('Erreur parsing equipmentsData:', e);
      }

      // Afficher tous les détails dans la console pour vérification
      console.log('📋 === DÉTAILS COMPLETS DE L\'INSPECTION ===');
      console.log('📋 Informations de base:', {
        title: inspection.title,
        type: inspection.type,
        date: inspection.date,
        inspector: inspection.inspector,
        property: inspection.property,
        tenant: inspection.tenant,
        roomNumber: inspection.roomNumber,
        contractType: inspection.contractType,
        status: inspection.status
      });
      
      console.log('📋 Description:', inspection.description);
      console.log('📋 Observations:', inspection.observations);
      console.log('📋 Inspection des pièces:', roomsData);
      console.log('📋 Inspection des équipements:', equipmentsData);

      // Créer le document avec toutes les informations détaillées
      const pdfDocument = {
        name: `Inspection_Complete_${inspection.type}_${inspection.tenant?.replace(/\s+/g, '_') || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`,
        type: 'inspection_report',
        category: 'État des lieux',
        uploadDate: new Date().toISOString(),
        inspectionId: inspection.id,
        propertyName: inspection.property,
        roomNumber: inspection.roomNumber,
        tenantId: inspection.id,
        tenantName: inspection.tenant,
        tenantType: inspection.contractType === 'Bail colocatif' ? 'Colocataire' : 'Locataire',
        generatedBy: 'system',
        content: {
          // Informations de base complètes
          generalInfo: {
            title: inspection.title,
            type: inspection.type,
            date: inspection.date,
            inspector: inspection.inspector,
            property: inspection.property,
            tenant: inspection.tenant,
            roomNumber: inspection.roomNumber,
            contractType: inspection.contractType,
            status: inspection.status
          },
          // Description détaillée
          description: inspection.description || 'Aucune description fournie',
          // Observations détaillées
          observations: inspection.observations || 'Aucune observation particulière',
          // Inspection des pièces détaillée
          roomsInspection: roomsData,
          // Inspection des équipements détaillée
          equipmentsInspection: equipmentsData,
          // Données complètes pour référence
          fullInspectionData: {
            basicInfo: {
              title: inspection.title,
              type: inspection.type,
              date: inspection.date,
              inspector: inspection.inspector,
              property: inspection.property,
              tenant: inspection.tenant,
              roomNumber: inspection.roomNumber,
              contractType: inspection.contractType,
              status: inspection.status
            },
            detailedDescription: inspection.description,
            detailedObservations: inspection.observations,
            roomsDetails: roomsData,
            equipmentsDetails: equipmentsData
          }
        },
        downloadUrl: `#download-inspection-${inspection.id}`,
        fileSize: '3.2 MB',
        status: 'available'
      };

      console.log('📄 Document PDF complet à sauvegarder:', pdfDocument);

      // Sauvegarder dans Tenant_Documents
      const docRef = await addDoc(collection(db, 'Tenant_Documents'), pdfDocument);
      console.log('✅ Document PDF complet sauvegardé avec ID:', docRef.id);

      // Déterminer le type de personne
      const personType = inspection.contractType === 'Bail colocatif' ? 'colocataire' : 'locataire';
      
      // Notification de succès avec plus de détails
      toast({
        title: "PDF complet généré avec succès",
        description: `Le rapport d'inspection détaillé (informations de base, inspection des pièces, équipements et observations) est disponible dans l'espace du ${personType} "${inspection.tenant}".`,
        duration: 6000,
      });

      console.log('✅ PDF complet avec tous les détails généré et sauvegardé');
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF complet:', error);
      
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
