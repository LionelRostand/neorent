
import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface PropertySettings {
  visible: boolean;
  description: string;
  featured: boolean;
}

export interface PropertySettingsMap {
  [propertyId: string]: PropertySettings;
}

export const usePropertySettings = () => {
  const { userProfile } = useAuth();
  const [propertySettings, setPropertySettings] = useState<PropertySettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const settingsDocId = userProfile?.id || 'default';

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'PropertyWebsiteSettings', settingsDocId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPropertySettings(docSnap.data().settings || {});
      } else {
        setPropertySettings({});
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching property settings:', err);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settings: PropertySettingsMap) => {
    try {
      const docRef = doc(db, 'PropertyWebsiteSettings', settingsDocId);
      await setDoc(docRef, { settings, updatedAt: new Date() });
      setPropertySettings(settings);
      return true;
    } catch (err) {
      console.error('Error saving property settings:', err);
      setError('Erreur lors de la sauvegarde');
      return false;
    }
  };

  const updatePropertySetting = async (propertyId: string, updates: Partial<PropertySettings>) => {
    const newSettings = {
      ...propertySettings,
      [propertyId]: {
        ...propertySettings[propertyId],
        ...updates
      }
    };
    return await saveSettings(newSettings);
  };

  const getVisibleProperties = () => {
    return Object.entries(propertySettings)
      .filter(([_, settings]) => settings.visible)
      .map(([propertyId]) => propertyId);
  };

  const getFeaturedProperties = () => {
    return Object.entries(propertySettings)
      .filter(([_, settings]) => settings.featured && settings.visible)
      .map(([propertyId]) => propertyId);
  };

  useEffect(() => {
    if (userProfile?.id) {
      fetchSettings();
    }
  }, [userProfile?.id]);

  return {
    propertySettings,
    loading,
    error,
    saveSettings,
    updatePropertySetting,
    getVisibleProperties,
    getFeaturedProperties,
    refetch: fetchSettings
  };
};
