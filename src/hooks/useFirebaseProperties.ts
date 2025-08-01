
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Property } from '@/types/property';

export const useFirebaseProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      console.log('🔄 Début récupération propriétés Firebase...');
      console.log('🔧 Configuration db:', db);
      console.log('🔧 App:', db.app);
      console.log('🔧 Project ID:', db.app.options.projectId);
      setLoading(true);
      
      // Test de connexion à Firebase avec collection Rent_properties
      console.log('📡 Test connexion Firebase avec collection Rent_properties...');
      const querySnapshot = await getDocs(collection(db, 'Rent_properties'));
      console.log(`📊 Firebase response: ${querySnapshot.docs.length} documents trouvés`);
      
      if (querySnapshot.empty) {
        console.log('❌ Collection Rent_properties est VIDE - Création d\'exemples de propriétés...');
        
        // Création de quelques propriétés d'exemple si la collection est vide
        const sampleProperties = [
          {
            title: "Appartement moderne - Centre ville",
            address: "15 Rue de la République, Paris 75001",
            type: "Appartement",
            surface: "65 m²",
            rent: "1800",
            status: "Libre",
            tenant: null,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            locationType: "Location",
            totalRooms: 3,
            availableRooms: 3,
            creditImmobilier: "",
            owner: "Propriétaire 1",
            charges: {
              electricity: 50,
              water: 30,
              maintenance: 100
            },
            floor: "3ème étage"
          },
          {
            title: "Studio lumineux - Quartier étudiant",
            address: "42 Avenue des Étudiants, Lyon 69007",
            type: "Studio",
            surface: "25 m²",
            rent: "650",
            status: "Libre",
            tenant: null,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            locationType: "Location",
            totalRooms: 1,
            availableRooms: 1,
            creditImmobilier: "",
            owner: "Propriétaire 2",
            charges: {
              electricity: 30,
              water: 20,
              maintenance: 50
            },
            floor: "2ème étage"
          },
          {
            title: "Colocation 4 chambres - Proche métro",
            address: "8 Boulevard du Métro, Marseille 13001",
            type: "Maison",
            surface: "120 m²",
            rent: "2400",
            status: "Partiellement occupé",
            tenant: null,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            locationType: "Colocation",
            totalRooms: 4,
            availableRooms: 2,
            creditImmobilier: "",
            owner: "Propriétaire 1",
            charges: {
              electricity: 80,
              water: 60,
              maintenance: 150
            },
            floor: "Rez-de-chaussée"
          }
        ];

        // Ajouter les propriétés d'exemple à Firebase
        for (const property of sampleProperties) {
          try {
            await addDoc(collection(db, 'Rent_properties'), property);
            console.log(`✅ Propriété ajoutée: ${property.title}`);
          } catch (addErr) {
            console.error(`❌ Erreur ajout propriété ${property.title}:`, addErr);
          }
        }

        // Relancer la récupération après ajout
        const newQuerySnapshot = await getDocs(collection(db, 'Rent_properties'));
        console.log(`📊 Nouvelles propriétés: ${newQuerySnapshot.docs.length} documents`);
        
        const propertiesData = newQuerySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        }) as Property[];
        
        setProperties(propertiesData);
        setError(null);
        return;
      }
      
      const propertiesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`📄 Document ${doc.id}:`, data);
        
        // Mapper les données Firebase vers le format Property attendu
        const mappedProperty = {
          id: doc.id,
          title: data.title || 'Propriété sans titre',
          address: `${data.streetNumber || ''} ${data.street || ''}, ${data.postalCode || ''}`.trim(),
          type: data.type || 'Non spécifié',
          surface: data.surface ? `${data.surface}` : '0',
          rent: data.rent ? `${data.rent}` : '0',
          status: data.status || 'Non spécifié',
          tenant: data.tenant || null,
          image: data.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          images: data.images || [],
          locationType: data.locationType || 'Location',
          totalRooms: data.totalRooms || 1,
          availableRooms: data.availableRooms || 1,
          creditImmobilier: data.creditImmobilier || '',
          owner: data.owner || '',
          charges: data.charges || {},
          floor: data.floor || ''
        };
        
        console.log(`✅ Propriété mappée:`, mappedProperty);
        return mappedProperty;
      }) as Property[];
      
      console.log(`✅ Propriétés récupérées:`, propertiesData);
      setProperties(propertiesData);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur Firebase détaillée:', err);
      console.error('❌ Type d\'erreur:', typeof err);
      console.error('❌ Message:', (err as any)?.message);
      console.error('❌ Code:', (err as any)?.code);
      setError('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
      // S'assurer qu'aucune valeur n'est undefined
      const cleanedData = {
        ...propertyData,
        totalRooms: propertyData.totalRooms || 0,
        availableRooms: propertyData.availableRooms || 0,
        creditImmobilier: propertyData.creditImmobilier || '',
        owner: propertyData.owner || '',
        charges: propertyData.charges || {},
        floor: propertyData.floor || ''
      };

      const docRef = await addDoc(collection(db, 'Rent_properties'), cleanedData);
      const newProperty = { id: docRef.id, ...cleanedData };
      setProperties(prev => [...prev, newProperty]);
      return newProperty;
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Erreur lors de l\'ajout du bien');
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      await updateDoc(doc(db, 'Rent_properties', id), updates);
      setProperties(prev => prev.map(property => 
        property.id === id ? { ...property, ...updates } : property
      ));
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Erreur lors de la mise à jour du bien');
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_properties', id));
      setProperties(prev => prev.filter(property => property.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Erreur lors de la suppression du bien');
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties
  };
};
