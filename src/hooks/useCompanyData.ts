
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  subsidiaries: string[];
  createdAt: string;
  updatedAt: string;
}

export const useCompanyData = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'company_config', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setCompany({ id: docSnap.id, ...docSnap.data() } as Company);
      } else {
        // Créer une entreprise par défaut
        const defaultCompany: Omit<Company, 'id'> = {
          name: 'Neo Rent',
          subsidiaries: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(docRef, defaultCompany);
        setCompany({ id: 'main', ...defaultCompany });
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'entreprise",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (updates: Partial<Omit<Company, 'id'>>) => {
    try {
      const docRef = doc(db, 'company_config', 'main');
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, updatedData, { merge: true });
      
      if (company) {
        setCompany({ ...company, ...updatedData });
      }
      
      toast({
        title: "Succès",
        description: "Entreprise mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return {
    company,
    loading,
    updateCompany,
    refetch: fetchCompany
  };
};
