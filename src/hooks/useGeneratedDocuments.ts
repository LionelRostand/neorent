import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirebaseContracts } from './useFirebaseContracts';
import { useFirebaseInspections } from './useFirebaseInspections';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GeneratedDocument {
  id: string;
  name: string;
  type: 'contract' | 'entry_inspection' | 'exit_inspection' | 'inspection_report';
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
            tenantId: contract.tenant,
            roommateId: undefined,
            propertyId: contract.property,
            status: 'signed',
            createdDate: contract.startDate || new Date().toISOString(),
            signedDate: contract.signedDate,
            sharedWith: ['landlord', 'tenant', 'roommate'],
            description: `Contrat de bail signé pour ${contract.property} - ${contract.tenant}`
          });
        }
      });

      // Ajouter les PDFs d'inspection générés
      await loadInspectionPDFs(generatedDocs);

      console.log('Generated documents loaded:', generatedDocs);
      setDocuments(generatedDocs);
    } catch (error) {
      console.error('Error loading generated documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInspectionPDFs = async (generatedDocs: GeneratedDocument[]) => {
    try {
      if (!userProfile?.name) return;

      // Chercher les PDFs d'inspection dans Tenant_Documents
      const q = query(
        collection(db, 'Tenant_Documents'),
        where('tenantName', '==', userProfile.name),
        where('type', '==', 'inspection_report')
      );
      
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        generatedDocs.push({
          id: `inspection-${data.inspectionId}`,
          name: data.name,
          type: 'inspection_report',
          contractId: undefined,
          tenantId: data.tenantId,
          roommateId: data.tenantType === 'Colocataire' ? data.tenantId : undefined,
          propertyId: data.propertyName,
          status: 'completed',
          createdDate: data.uploadDate,
          sharedWith: ['landlord', 'tenant', 'roommate'],
          description: `Rapport d'inspection pour ${data.propertyName}${data.roomNumber ? ` - ${data.roomNumber}` : ''}`
        });
      });

      console.log(`Loaded ${querySnapshot.docs.length} inspection PDFs for ${userProfile.name}`);
    } catch (error) {
      console.error('Error loading inspection PDFs:', error);
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