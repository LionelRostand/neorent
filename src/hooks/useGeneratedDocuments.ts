import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirebaseContracts } from './useFirebaseContracts';
import { useFirebaseInspections } from './useFirebaseInspections';

export interface GeneratedDocument {
  id: string;
  name: string;
  type: 'contract' | 'entry_inspection' | 'exit_inspection';
  contractId?: string;
  tenantId?: string;
  roommateId?: string;
  propertyId?: string;
  status: 'draft' | 'signed' | 'completed';
  createdDate: string;
  signedDate?: string;
  downloadUrl?: string;
  sharedWith: ('landlord' | 'tenant' | 'roommate')[];
  description: string;
}

export const useGeneratedDocuments = (userId?: string, userType?: string, userProfile?: any) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { contracts } = useFirebaseContracts();
  const { inspections } = useFirebaseInspections();

  useEffect(() => {
    if (userId && userType) {
      loadGeneratedDocuments();
    }
  }, [userId, userType, contracts, inspections]);

  const loadGeneratedDocuments = async () => {
    setLoading(true);
    try {
      const generatedDocs: GeneratedDocument[] = [];

      // Ajouter les contrats signés
      contracts.forEach(contract => {
        if (contract.status === 'Signé') {
          generatedDocs.push({
            id: `contract-${contract.id}`,
            name: `Contrat de bail - ${contract.property}`,
            type: 'contract',
            contractId: contract.id,
            tenantId: contract.tenant, // Using tenant name as ID for now
            roommateId: undefined, // Not available in current contract structure
            propertyId: contract.property, // Using property name as ID for now
            status: 'signed',
            createdDate: contract.startDate || new Date().toISOString(),
            signedDate: contract.signedDate,
            sharedWith: ['landlord', 'tenant', 'roommate'],
            description: `Contrat de bail signé pour ${contract.property} - ${contract.tenant}`
          });
        }
      });

      // Ajouter les états des lieux d'entrée
      inspections.forEach(inspection => {
        if (inspection.type === 'entry' && inspection.status === 'completed') {
          generatedDocs.push({
            id: `entry-inspection-${inspection.id}`,
            name: `État des lieux d'entrée - ${inspection.property}`,
            type: 'entry_inspection',
            contractId: undefined, // Not available in current inspection structure
            tenantId: inspection.tenant, // Using tenant name as ID for now
            roommateId: undefined, // Not available in current inspection structure  
            propertyId: inspection.property, // Using property name as ID for now
            status: 'completed',
            createdDate: inspection.date || new Date().toISOString(),
            signedDate: inspection.date,
            sharedWith: ['landlord', 'tenant', 'roommate'],
            description: `État des lieux d'entrée complété pour ${inspection.property}`
          });
        }
      });

      // Ajouter les états des lieux de sortie
      inspections.forEach(inspection => {
        if (inspection.type === 'exit' && inspection.status === 'completed') {
          generatedDocs.push({
            id: `exit-inspection-${inspection.id}`,
            name: `État des lieux de sortie - ${inspection.property}`,
            type: 'exit_inspection',
            contractId: undefined, // Not available in current inspection structure
            tenantId: inspection.tenant, // Using tenant name as ID for now
            roommateId: undefined, // Not available in current inspection structure
            propertyId: inspection.property, // Using property name as ID for now
            status: 'completed',
            createdDate: inspection.date || new Date().toISOString(),
            signedDate: inspection.date,
            sharedWith: ['landlord', 'tenant', 'roommate'],
            description: `État des lieux de sortie complété pour ${inspection.property}`
          });
        }
      });

      // Filtrer les documents selon le type d'utilisateur
      const filteredDocs = generatedDocs.filter(doc => {
        if (userType === 'admin' || userType === 'owner') {
          return doc.sharedWith.includes('landlord');
        } else if (userType === 'locataire') {
          return doc.sharedWith.includes('tenant') && 
                 (doc.tenantId === userId || doc.tenantId === userProfile?.name);
        } else if (userType === 'colocataire') {
          return doc.sharedWith.includes('roommate') && 
                 (doc.roommateId === userId || doc.tenantId === userProfile?.name);
        }
        return false;
      });

      setDocuments(filteredDocs);
    } catch (error) {
      console.error('Error loading generated documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (document: GeneratedDocument) => {
    try {
      // Ici, on simulerait la génération/téléchargement du PDF
      // En réalité, cela ferait appel à un service de génération de PDF
      console.log('Downloading document:', document);
      
      // Mock download - en réalité, cela générerait le PDF à partir des données
      const fileName = `${document.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      // Pour l'instant, on simule le téléchargement
      alert(`Téléchargement du document: ${fileName}`);
      
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  };

  return {
    documents,
    loading,
    downloadDocument,
    refreshDocuments: loadGeneratedDocuments
  };
};