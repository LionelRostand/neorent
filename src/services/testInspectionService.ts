import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Test pour créer un document d'inspection directement
export const createTestInspectionDocument = async (tenantName: string) => {
  try {
    console.log('🧪 Création d\'un document de test pour:', tenantName);
    
    const testDocument = {
      name: `Test_Inspection_${tenantName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      type: 'inspection_report',
      category: 'État des lieux',
      uploadDate: new Date().toISOString(),
      inspectionId: `test-${Date.now()}`,
      propertyName: 'Appartement 13',
      roomNumber: 'Chambre 1',
      tenantId: 'test-tenant-id',
      tenantName: tenantName,
      tenantType: 'Colocataire',
      generatedBy: 'system',
      content: {
        generalInfo: {
          title: 'Test État des Lieux',
          type: 'État des lieux d\'entrée',
          date: '01/03/2025',
          inspector: 'Lionel DJOSSA',
          property: 'Appartement 13',
          tenant: tenantName,
          roomNumber: 'Chambre 1'
        },
        description: 'Document de test généré automatiquement',
        observations: 'Test d\'observation',
        status: 'Planifié'
      },
      downloadUrl: `#download-test-${Date.now()}`,
      fileSize: '2.5 MB',
      status: 'available'
    };

    // Sauvegarder dans Tenant_Documents
    const docRef = await addDoc(collection(db, 'Tenant_Documents'), testDocument);
    console.log('✅ Document de test créé avec l\'ID:', docRef.id);
    console.log('✅ Document sauvegardé:', testDocument);
    
    return {
      success: true,
      documentId: docRef.id,
      document: testDocument
    };
  } catch (error) {
    console.error('❌ Erreur lors de la création du document de test:', error);
    return {
      success: false,
      error: error
    };
  }
};