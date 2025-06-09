
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantName: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  status: string;
  requestDate: string;
  responsibility: string;
  createdAt?: Timestamp;
}

interface MaintenanceIntervention {
  id: string;
  requestId: string;
  property: string;
  description: string;
  status: string;
  priority: string;
  technicianName: string;
  technicianPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedCost: number;
  actualCost: number | null;
  completionNotes: string;
}

interface MaintenanceInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  property: string;
  description: string;
  technicianName: string;
  amount: number;
  responsibility: string;
  status: string;
  tenantNotified: boolean;
}

export const useFirebaseMaintenances = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [interventions, setInterventions] = useState<MaintenanceIntervention[]>([]);
  const [invoices, setInvoices] = useState<MaintenanceInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, 'rent_maintenances'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
      setRequests(requestsData);
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError('Erreur lors du chargement des demandes');
    }
  };

  const fetchInterventions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rent_interventions'));
      const interventionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceIntervention[];
      setInterventions(interventionsData);
    } catch (err) {
      console.error('Error fetching interventions:', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rent_invoices'));
      const invoicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceInvoice[];
      setInvoices(invoicesData);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  const addRequest = async (requestData: Omit<MaintenanceRequest, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'rent_maintenances'), {
        ...requestData,
        createdAt: Timestamp.now()
      });
      const newRequest = { id: docRef.id, ...requestData };
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      console.error('Error adding maintenance request:', err);
      setError('Erreur lors de l\'ajout de la demande');
      throw err;
    }
  };

  const addIntervention = async (interventionData: Omit<MaintenanceIntervention, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'rent_interventions'), interventionData);
      const newIntervention = { id: docRef.id, ...interventionData };
      setInterventions(prev => [...prev, newIntervention]);
      return newIntervention;
    } catch (err) {
      console.error('Error adding intervention:', err);
      throw err;
    }
  };

  const updateIntervention = async (id: string, updates: Partial<MaintenanceIntervention>) => {
    try {
      await updateDoc(doc(db, 'rent_interventions', id), updates);
      setInterventions(prev => prev.map(intervention => 
        intervention.id === id ? { ...intervention, ...updates } : intervention
      ));
    } catch (err) {
      console.error('Error updating intervention:', err);
      throw err;
    }
  };

  const addInvoice = async (invoiceData: Omit<MaintenanceInvoice, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'rent_invoices'), invoiceData);
      const newInvoice = { id: docRef.id, ...invoiceData };
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      console.error('Error adding invoice:', err);
      throw err;
    }
  };

  const getRecentRequests = () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    return requests.filter(request => {
      const requestDate = new Date(request.requestDate);
      return requestDate >= twoDaysAgo;
    });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchRequests(), fetchInterventions(), fetchInvoices()]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  return {
    requests,
    interventions,
    invoices,
    loading,
    error,
    addRequest,
    addIntervention,
    updateIntervention,
    addInvoice,
    getRecentRequests,
    refetch: () => Promise.all([fetchRequests(), fetchInterventions(), fetchInvoices()])
  };
};
