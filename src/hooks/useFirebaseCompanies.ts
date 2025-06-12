
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface Company {
  id: string;
  name: string;
  subsidiaries: string[];
  address?: string;
  phone?: string;
  email?: string;
  siret?: string;
  createdAt: string;
  updatedAt: string;
}

export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_entreprises'));
      const companiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Company[];
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCompany = {
        ...companyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'Rent_entreprises'), newCompany);
      
      toast({
        title: "Succès",
        description: "Entreprise ajoutée avec succès",
      });
      
      fetchCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'entreprise",
        variant: "destructive",
      });
    }
  };

  const updateCompany = async (id: string, companyData: Partial<Omit<Company, 'id' | 'createdAt'>>) => {
    try {
      const updatedData = {
        ...companyData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'Rent_entreprises', id), updatedData);
      
      toast({
        title: "Succès",
        description: "Entreprise modifiée avec succès",
      });
      
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de l'entreprise",
        variant: "destructive",
      });
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_entreprises', id));
      
      toast({
        title: "Succès",
        description: "Entreprise supprimée avec succès",
      });
      
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'entreprise",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  };
};
