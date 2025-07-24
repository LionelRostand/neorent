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
    // 1. Sauvegarder dans l'espace du locataire/colocataire
    await savePDFToTenantSpace(pdfData);
    
    // 2. Sauvegarder dans l'espace du propriétaire
    await savePDFToOwnerSpace(pdfData);
    
    console.log('PDF sauvegardé avec succès dans les espaces locataire et propriétaire');
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du PDF:', error);
    throw error;
  }
};

const savePDFToTenantSpace = async (pdfData: InspectionPDFData) => {
  // Trouver le locataire/colocataire par nom
  const tenant = await findTenantByName(pdfData.tenantName);
  
  if (tenant) {
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
    await addDoc(collection(db, 'Tenant_Documents'), documentData);
    console.log(`PDF ajouté à l'espace du ${tenant.type}: ${tenant.name}`);
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
    // Chercher dans les locataires
    const tenantsQuery = query(
      collection(db, 'Rent_tenants'),
      where('name', '==', tenantName)
    );
    const tenantsSnapshot = await getDocs(tenantsQuery);
    
    if (!tenantsSnapshot.empty) {
      const tenant = tenantsSnapshot.docs[0];
      return {
        id: tenant.id,
        name: tenant.data().name,
        type: 'Locataire',
        ...tenant.data()
      };
    }

    // Chercher dans les colocataires
    const roommatesQuery = query(
      collection(db, 'Rent_roommates'),
      where('name', '==', tenantName)
    );
    const roommatesSnapshot = await getDocs(roommatesQuery);
    
    if (!roommatesSnapshot.empty) {
      const roommate = roommatesSnapshot.docs[0];
      return {
        id: roommate.id,
        name: roommate.data().name,
        type: 'Colocataire',
        ...roommate.data()
      };
    }

    console.warn(`Locataire/Colocataire non trouvé: ${tenantName}`);
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche du locataire:', error);
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