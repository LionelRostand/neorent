import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const deleteTestInspectionDocuments = async (tenantName: string) => {
  try {
    console.log('🗑️ Suppression des documents de test pour:', tenantName);
    
    // Chercher tous les documents de test pour ce locataire/colocataire
    const q = query(
      collection(db, 'Tenant_Documents'),
      where('tenantName', '==', tenantName),
      where('type', '==', 'inspection_report')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`🗑️ Trouvé ${querySnapshot.docs.length} documents à supprimer`);
    
    const deletePromises = querySnapshot.docs.map(async (document) => {
      const data = document.data();
      // Supprimer seulement les documents de test (qui commencent par "Test_")
      if (data.name && data.name.startsWith('Test_')) {
        console.log('🗑️ Suppression du document:', data.name);
        await deleteDoc(doc(db, 'Tenant_Documents', document.id));
        return { success: true, documentName: data.name };
      }
      return { success: false, documentName: data.name };
    });
    
    const results = await Promise.all(deletePromises);
    const deletedCount = results.filter(r => r.success).length;
    
    console.log(`✅ ${deletedCount} documents de test supprimés`);
    return {
      success: true,
      deletedCount: deletedCount,
      totalFound: querySnapshot.docs.length
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des documents de test:', error);
    return {
      success: false,
      error: error
    };
  }
};