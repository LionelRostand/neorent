import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('🧪 TEST FIREBASE DIRECT');
        console.log('🔧 Database:', db);
        
        // Test direct de la collection
        const snapshot = await getDocs(collection(db, 'Rent_properties'));
        console.log('📊 Snapshot:', snapshot);
        console.log('📊 Docs length:', snapshot.docs.length);
        console.log('📊 Empty:', snapshot.empty);
        
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
        
        console.log('📄 All documents:', docs);
        setProperties(docs);
        setStatus(`Trouvé ${docs.length} propriétés`);
        
      } catch (error) {
        console.error('❌ Erreur Firebase test:', error);
        setStatus(`Erreur: ${(error as any).message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid red', 
      padding: '10px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3>🧪 Test Firebase</h3>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Propriétés:</strong> {properties.length}</p>
      {properties.map((prop, i) => (
        <div key={i} style={{ fontSize: '12px', marginBottom: '5px' }}>
          <strong>{prop.id}:</strong> {prop.data.title || 'Sans titre'}
        </div>
      ))}
    </div>
  );
};