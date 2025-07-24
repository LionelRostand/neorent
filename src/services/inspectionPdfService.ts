import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface InspectionPDFData {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  inspectionId: string;
  tenantName: string;
  propertyName: string;
  roomNumber?: string;
  contractType?: string;
  content: any;
}

export const saveInspectionPDFToSpaces = async (pdfData: InspectionPDFData) => {
  try {
    console.log('📄 Starting PDF save process for:', pdfData.tenantName);
    
    // 1. Sauvegarder dans l'espace du locataire/colocataire
    await savePDFToTenantSpace(pdfData);
    
    // 2. Sauvegarder dans l'espace du propriétaire
    await savePDFToOwnerSpace(pdfData);
    
    console.log('✅ PDF sauvegardé avec succès dans les espaces locataire et propriétaire');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du PDF:', error);
    throw error;
  }
};

const savePDFToTenantSpace = async (pdfData: InspectionPDFData) => {
  console.log('🔍 Recherche du locataire/colocataire:', pdfData.tenantName);
  // Trouver le locataire/colocataire par nom
  const tenant = await findTenantByName(pdfData.tenantName);
  
  if (tenant) {
    console.log(`✅ Locataire/colocataire trouvé:`, tenant);
    const documentData = {
      name: pdfData.name,
      type: 'inspection_report',
      category: 'État des lieux',
      uploadDate: pdfData.uploadDate,
      inspectionId: pdfData.inspectionId,
      propertyName: pdfData.propertyName,
      roomNumber: pdfData.roomNumber,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantType: tenant.type,
      generatedBy: 'system',
      content: pdfData.content,
      downloadUrl: `#download-inspection-${pdfData.inspectionId}`, // URL symbolique
      fileSize: '2.5 MB', // Simulation
      status: 'available'
    };

    // Sauvegarder dans la collection des documents des locataires
    console.log('💾 Sauvegarde du document dans Tenant_Documents:', documentData);
    await addDoc(collection(db, 'Tenant_Documents'), documentData);
    console.log(`📄 PDF ajouté à l'espace du ${tenant.type}: ${tenant.name}`);
  } else {
    console.warn(`⚠️  Locataire/colocataire non trouvé: ${pdfData.tenantName}`);
  }
};

const savePDFToOwnerSpace = async (pdfData: InspectionPDFData) => {
  // Trouver le propriétaire de la propriété
  const owner = await findOwnerByProperty(pdfData.propertyName);
  
  if (owner) {
    const documentData = {
      name: pdfData.name,
      type: 'inspection_report',
      category: 'État des lieux',
      uploadDate: pdfData.uploadDate,
      inspectionId: pdfData.inspectionId,
      propertyName: pdfData.propertyName,
      roomNumber: pdfData.roomNumber,
      tenantName: pdfData.tenantName,
      ownerId: owner.id,
      ownerName: owner.name,
      generatedBy: 'system',
      content: pdfData.content,
      downloadUrl: `#download-inspection-${pdfData.inspectionId}`, // URL symbolique
      fileSize: '2.5 MB', // Simulation
      status: 'available'
    };

    // Sauvegarder dans la collection des documents des propriétaires
    await addDoc(collection(db, 'Owner_Documents'), documentData);
    console.log(`PDF ajouté à l'espace du propriétaire: ${owner.name}`);
  }
};

const findTenantByName = async (tenantName: string) => {
  try {
    console.log('🔍 Recherche du locataire/colocataire avec le nom:', tenantName);
    
    // Normaliser le nom pour la recherche (enlever les espaces supplémentaires, etc.)
    const normalizedSearchName = tenantName.trim().toLowerCase();
    console.log('🔍 Nom normalisé pour recherche:', normalizedSearchName);

    // Chercher dans les locataires
    const tenantsQuery = collection(db, 'Rent_tenants');
    const tenantsSnapshot = await getDocs(tenantsQuery);
    
    console.log('🔍 Recherche dans', tenantsSnapshot.docs.length, 'locataires');
    
    for (const doc of tenantsSnapshot.docs) {
      const data = doc.data();
      const tenantNormalized = data.name?.trim().toLowerCase();
      console.log('🔍 Comparaison:', normalizedSearchName, 'vs', tenantNormalized);
      
      if (tenantNormalized === normalizedSearchName || 
          normalizedSearchName.includes(tenantNormalized) || 
          tenantNormalized?.includes(normalizedSearchName)) {
        console.log('✅ Locataire trouvé dans Rent_tenants:', data);
        return {
          id: doc.id,
          name: data.name,
          type: 'Locataire',
          ...data
        };
      }
    }

    // Chercher dans les colocataires
    const roommatesQuery = collection(db, 'Rent_roommates');
    const roommatesSnapshot = await getDocs(roommatesQuery);
    
    console.log('🔍 Recherche dans', roommatesSnapshot.docs.length, 'colocataires');
    
    for (const doc of roommatesSnapshot.docs) {
      const data = doc.data();
      const roommateNormalized = data.name?.trim().toLowerCase();
      console.log('🔍 Comparaison:', normalizedSearchName, 'vs', roommateNormalized);
      
      if (roommateNormalized === normalizedSearchName || 
          normalizedSearchName.includes(roommateNormalized) || 
          roommateNormalized?.includes(normalizedSearchName)) {
        console.log('✅ Colocataire trouvé dans Rent_roommates:', data);
        return {
          id: doc.id,
          name: data.name,
          type: 'Colocataire',
          ...data
        };
      }
    }

    console.warn(`⚠️ Aucun locataire/colocataire trouvé pour: ${tenantName}`);
    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la recherche du locataire:', error);
    return null;
  }
};

const findOwnerByProperty = async (propertyName: string) => {
  try {
    // Chercher la propriété pour trouver le propriétaire
    const propertiesQuery = query(
      collection(db, 'Rent_properties'),
      where('title', '==', propertyName)
    );
    const propertiesSnapshot = await getDocs(propertiesQuery);
    
    if (!propertiesSnapshot.empty) {
      const property = propertiesSnapshot.docs[0].data();
      const ownerName = property.owner;
      
      if (ownerName) {
        // Chercher le propriétaire par nom
        const ownersQuery = query(
          collection(db, 'Rent_owners'),
          where('name', '==', ownerName)
        );
        const ownersSnapshot = await getDocs(ownersQuery);
        
        if (!ownersSnapshot.empty) {
          const owner = ownersSnapshot.docs[0];
          return {
            id: owner.id,
            name: owner.data().name,
            ...owner.data()
          };
        }
      }
    }

    console.warn(`Propriétaire non trouvé pour la propriété: ${propertyName}`);
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche du propriétaire:', error);
    return null;
  }
};