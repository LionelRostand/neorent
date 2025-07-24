
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import jsPDF from 'jspdf';

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

  // Fonction pour générer un ID unique basé sur le nom du colocataire
  const generateTenantId = (tenantName: string) => {
    // Pour "Emad ADAM", utiliser un ID fixe pour cohérence
    if (tenantName === 'Emad ADAM') {
      return 'emad_adam_tenant_id';
    }
    // Pour les autres, générer un ID basé sur le nom
    return tenantName.toLowerCase().replace(/\s+/g, '_') + '_tenant_id';
  };

  const handleGeneratePDF = async () => {
    if (!inspection) return;

    try {
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

      // Créer le PDF avec jsPDF
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      let currentY = 20;

      // Fonction pour ajouter une nouvelle page si nécessaire
      const addPageIfNeeded = (neededSpace: number) => {
        if (currentY + neededSpace > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
      };

      // === TITRE DU DOCUMENT ===
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT D\'INSPECTION COMPLET', 20, currentY);
      currentY += 15;

      // === 1. INFORMATIONS DE BASE ===
      addPageIfNeeded(50);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('1. INFORMATIONS DE BASE', 20, currentY);
      currentY += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const basicInfo = [
        `Titre: ${inspection.title}`,
        `Type: ${inspection.type}`,
        `Date: ${inspection.date}`,
        `Inspecteur: ${inspection.inspector}`,
        `Propriété: ${inspection.property}`,
        `Locataire: ${inspection.tenant}`,
        `Numéro de chambre: ${inspection.roomNumber || 'N/A'}`,
        `Type de contrat: ${inspection.contractType || 'N/A'}`,
        `Statut: ${inspection.status}`
      ];

      basicInfo.forEach(info => {
        addPageIfNeeded(8);
        doc.text(info, 20, currentY);
        currentY += 8;
      });

      currentY += 10;

      // === 2. DESCRIPTION ===
      if (inspection.description) {
        addPageIfNeeded(30);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('2. DESCRIPTION', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const splitDescription = doc.splitTextToSize(inspection.description, 170);
        splitDescription.forEach((line: string) => {
          addPageIfNeeded(8);
          doc.text(line, 20, currentY);
          currentY += 8;
        });
        currentY += 10;
      }

      // === 3. INSPECTION DES PIÈCES ===
      if (Object.keys(roomsData).length > 0) {
        addPageIfNeeded(30);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('3. INSPECTION DES PIÈCES', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        Object.entries(roomsData).forEach(([roomName, roomInfo]: [string, any]) => {
          addPageIfNeeded(20);
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${roomName}:`, 20, currentY);
          currentY += 8;
          
          doc.setFont('helvetica', 'normal');
          if (typeof roomInfo === 'object') {
            Object.entries(roomInfo).forEach(([key, value]) => {
              addPageIfNeeded(8);
              doc.text(`  - ${key}: ${value}`, 25, currentY);
              currentY += 8;
            });
          } else {
            addPageIfNeeded(8);
            doc.text(`  ${roomInfo}`, 25, currentY);
            currentY += 8;
          }
          currentY += 5;
        });
        currentY += 10;
      }

      // === 4. INSPECTION DES ÉQUIPEMENTS ===
      if (Object.keys(equipmentsData).length > 0) {
        addPageIfNeeded(30);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('4. INSPECTION DES ÉQUIPEMENTS', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        Object.entries(equipmentsData).forEach(([equipmentName, equipmentInfo]: [string, any]) => {
          addPageIfNeeded(20);
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${equipmentName}:`, 20, currentY);
          currentY += 8;
          
          doc.setFont('helvetica', 'normal');
          if (typeof equipmentInfo === 'object') {
            Object.entries(equipmentInfo).forEach(([key, value]) => {
              addPageIfNeeded(8);
              doc.text(`  - ${key}: ${value}`, 25, currentY);
              currentY += 8;
            });
          } else {
            addPageIfNeeded(8);
            doc.text(`  ${equipmentInfo}`, 25, currentY);
            currentY += 8;
          }
          currentY += 5;
        });
        currentY += 10;
      }

      // === 5. OBSERVATIONS ===
      if (inspection.observations) {
        addPageIfNeeded(30);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('5. OBSERVATIONS', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const splitObservations = doc.splitTextToSize(inspection.observations, 170);
        splitObservations.forEach((line: string) => {
          addPageIfNeeded(8);
          doc.text(line, 20, currentY);
          currentY += 8;
        });
      }

      // Télécharger le PDF
      const fileName = `Inspection_${inspection.type}_${inspection.tenant?.replace(/\s+/g, '_') || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      // Aussi sauvegarder dans Firebase pour l'espace locataire
      // Générer un ID tenant basé sur le nom du colocataire/locataire
      const tenantId = generateTenantId(inspection.tenant || 'Unknown');
      
      const pdfDocument = {
        name: fileName,
        type: 'inspection_report',
        category: 'État des lieux',
        uploadDate: new Date().toISOString(),
        inspectionId: inspection.id,
        propertyName: inspection.property,
        roomNumber: inspection.roomNumber,
        tenantId: tenantId, // Utiliser l'ID généré basé sur le nom
        tenantName: inspection.tenant,
        tenantType: inspection.contractType === 'Bail colocatif' ? 'Colocataire' : 'Locataire',
        generatedBy: 'system',
        content: {
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
          description: inspection.description || 'Aucune description fournie',
          observations: inspection.observations || 'Aucune observation particulière',
          roomsInspection: roomsData,
          equipmentsInspection: equipmentsData
        },
        downloadUrl: `#download-inspection-${inspection.id}`,
        fileSize: '2.1 MB',
        status: 'available'
      };

      await addDoc(collection(db, 'Tenant_Documents'), pdfDocument);

      // Notification de succès
      const personType = inspection.contractType === 'Bail colocatif' ? 'colocataire' : 'locataire';
      toast({
        title: "PDF généré avec succès",
        description: `Le rapport complet a été téléchargé et est disponible dans l'espace du ${personType} "${inspection.tenant}".`,
        duration: 6000,
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      
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
