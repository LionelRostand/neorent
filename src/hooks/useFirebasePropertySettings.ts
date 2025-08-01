import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PropertySettings {
  propertyId: string;
  visible: boolean;
  description: string;
  featured: boolean;
}

export const useFirebasePropertySettings = () => {
  const [propertySettings, setPropertySettings] = useState<{[key: string]: {
    visible: boolean;
    description: string;
    featured: boolean;
  }}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres depuis Firebase
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsCollection = collection(db, 'property_website_settings');
      const snapshot = await getDocs(settingsCollection);
      
      const settingsMap: any = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        settingsMap[data.propertyId] = {
          visible: data.visible,
          description: data.description || '',
          featured: data.featured || false
        };
      });
      
      setPropertySettings(settingsMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching property settings:', err);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les paramètres dans Firebase
  const saveSettings = async (settings: {[key: string]: {visible: boolean; description: string; featured: boolean}}) => {
    try {
      const settingsCollection = collection(db, 'property_website_settings');
      
      // Supprimer tous les anciens paramètres
      const snapshot = await getDocs(settingsCollection);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Ajouter les nouveaux paramètres
      const savePromises = Object.entries(settings).map(([propertyId, setting]) => {
        const docRef = doc(settingsCollection, propertyId);
        return setDoc(docRef, {
          propertyId,
          visible: setting.visible,
          description: setting.description,
          featured: setting.featured
        });
      });
      
      await Promise.all(savePromises);
      setError(null);
    } catch (err) {
      console.error('Error saving property settings:', err);
      setError('Erreur lors de la sauvegarde');
      throw err;
    }
  };

  // Mettre à jour un paramètre spécifique
  const updatePropertySetting = async (propertyId: string, updates: Partial<{visible: boolean; description: string; featured: boolean}>) => {
    try {
      const docRef = doc(db, 'property_website_settings', propertyId);
      const currentSetting = propertySettings[propertyId] || { visible: true, description: '', featured: false };
      
      const newSetting = { ...currentSetting, ...updates };
      
      await setDoc(docRef, {
        propertyId,
        visible: newSetting.visible,
        description: newSetting.description,
        featured: newSetting.featured
      });
      
      setPropertySettings(prev => ({
        ...prev,
        [propertyId]: newSetting
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error updating property setting:', err);
      setError('Erreur lors de la mise à jour');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    propertySettings,
    loading,
    error,
    saveSettings,
    updatePropertySetting,
    refetch: fetchSettings
  };
};