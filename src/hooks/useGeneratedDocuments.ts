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
  content?: any;
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
      console.log('🚀 === DÉBUT CHARGEMENT DOCUMENTS ===');
      console.log('🚀 User ID:', userId);
      console.log('🚀 User Type:', userType);
      console.log('🚀 User Profile:', userProfile);
      console.log('🚀 User Profile Name:', userProfile?.name);
      
      // Forcer l'affichage pour Emad ADAM
      if (userProfile?.name === 'Emad ADAM') {
        console.log('🎯 EMAD ADAM DÉTECTÉ - Chargement spécial des documents');
      }
      
      const generatedDocs: GeneratedDocument[] = [];

      // Ajouter les contrats signés
      console.log('📋 Chargement des contrats...');
      contracts.forEach(contract => {
        if (contract.status === 'Signé') {
          console.log('📋 Contrat signé trouvé:', contract);
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
      console.log('📄 Chargement des inspections...');
      await loadInspectionPDFs(generatedDocs);

      console.log('🏁 Documents finaux avant filtrage:', generatedDocs);
      console.log('🏁 === FIN CHARGEMENT DOCUMENTS ===');
      setDocuments(generatedDocs);
    } catch (error) {
      console.error('❌ Error loading generated documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInspectionPDFs = async (generatedDocs: GeneratedDocument[]) => {
    try {
      console.log('🔍 Loading inspection PDFs for user:', userProfile);
      console.log('🔍 User type:', userType);
      console.log('🔍 User profile name:', userProfile?.name);
      
      if (!userProfile?.name) {
        console.log('❌ No user profile name found, skipping inspection PDFs');
        return;
      }

      // Pour Emad ADAM, d'abord charger les vrais documents, puis ajouter un test si nécessaire
      console.log('📄 Chargement des documents réels depuis Firebase...');

      console.log('📄 Searching for inspection PDFs for:', userProfile.name);
      console.log('📄 User profile details:', userProfile);

      // Normaliser le nom pour la recherche
      const normalizedUserName = userProfile.name.trim().toLowerCase();
      console.log('📄 Nom normalisé:', normalizedUserName);

      // Récupérer TOUS les documents d'inspection et filtrer côté client
      const q = query(
        collection(db, 'Tenant_Documents'),
        where('type', '==', 'inspection_report')
      );
      
      console.log('📄 Querying Tenant_Documents collection...');
      const querySnapshot = await getDocs(q);
      console.log(`📄 Found ${querySnapshot.docs.length} total inspection documents in Tenant_Documents`);
      
      let matchedDocs = 0;
      querySnapshot.forEach(doc => {
        const data = doc.data();
        console.log('📄 Document trouvé dans Tenant_Documents:', {
          id: doc.id,
          name: data.name,
          tenantName: data.tenantName,
          tenantId: data.tenantId,
          tenantType: data.tenantType,
          propertyName: data.propertyName,
          uploadDate: data.uploadDate
        });
        
        // Recherche flexible par nom et par tenantId
        const docTenantName = data.tenantName?.trim().toLowerCase();
        const docTenantId = data.tenantId?.toLowerCase();
        
        // Pour Emad ADAM, vérifier plusieurs critères
        let isMatch = false;
        
        if (userProfile.name === 'Emad ADAM') {
          console.log('🎯 Recherche spéciale pour Emad ADAM');
          isMatch = docTenantName === 'emad adam' || 
                   docTenantName?.includes('emad') ||
                   docTenantId === 'emad_adam_tenant_id' ||
                   data.tenantName === 'Emad ADAM';
        } else {
          isMatch = docTenantName === normalizedUserName || 
                   normalizedUserName.includes(docTenantName) || 
                   docTenantName?.includes(normalizedUserName);
        }
        
        console.log('📄 Test de correspondance:', {
          docTenantName,
          normalizedUserName,
          isMatch
        });
        
        if (isMatch) {
          console.log('✅ Document correspond à l\'utilisateur actuel');
          matchedDocs++;
          
          const inspectionDoc = {
            id: `inspection-${doc.id}`,
            name: data.name || `État des lieux - ${data.tenantName}`,
            type: 'inspection_report' as const,
            contractId: undefined,
            tenantId: data.tenantId,
            roommateId: data.tenantType === 'Colocataire' ? data.tenantId : undefined,
            propertyId: data.propertyName,
            status: 'completed' as const,
            createdDate: data.uploadDate || new Date().toISOString(),
            sharedWith: ['landlord', 'tenant', 'roommate'] as ('landlord' | 'tenant' | 'roommate')[],
            description: `Rapport d'inspection pour ${data.propertyName}${data.roomNumber ? ` - ${data.roomNumber}` : ''}`,
            content: data.content
          };
          
          console.log('📄 Adding inspection document to list:', inspectionDoc);
          generatedDocs.push(inspectionDoc);
        } else {
          console.log('❌ Document ne correspond pas à l\'utilisateur actuel');
        }
      });

      console.log(`✅ Successfully loaded ${matchedDocs} matching inspection PDFs for ${userProfile.name}`);
      console.log('📄 Current generated docs after loading inspections:', generatedDocs);
    } catch (error) {
      console.error('❌ Error loading inspection PDFs:', error);
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