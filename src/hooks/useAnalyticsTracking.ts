
import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface AnalyticsData {
  visitorsToday: number;
  pageViews: number;
  contactRequests: number;
  weeklyVisitors: Array<{
    name: string;
    visitors: number;
  }>;
}

export const useAnalyticsTracking = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitorsToday: 0,
    pageViews: 0,
    contactRequests: 0,
    weeklyVisitors: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasRealData, setHasRealData] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  const trackPageView = useCallback(async (page: string, userAgent?: string) => {
    try {
      // Ne pas tracker si pas d'utilisateur ou erreur de permission
      if (!user || permissionError) return;
      
      await addDoc(collection(db, 'rent_analytics'), {
        type: 'page_view',
        page: page,
        timestamp: Timestamp.now(),
        userAgent: userAgent || navigator.userAgent,
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      console.error('Erreur lors du tracking de page:', error);
      if (error.code === 'permission-denied') {
        setPermissionError(true);
      }
    }
  }, [user, permissionError]);

  const trackContactRequest = useCallback(async (contactType: string) => {
    try {
      // Ne pas tracker si pas d'utilisateur ou erreur de permission
      if (!user || permissionError) return;
      
      await addDoc(collection(db, 'rent_analytics'), {
        type: 'contact_request',
        contactType: contactType,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      console.error('Erreur lors du tracking de contact:', error);
      if (error.code === 'permission-denied') {
        setPermissionError(true);
      }
    }
  }, [user, permissionError]);

  const fetchAnalyticsData = useCallback(async () => {
    // Ne pas essayer de récupérer les données si pas d'utilisateur
    if (!user) {
      console.log('📊 Pas d\'utilisateur connecté pour les analytics');
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Récupération des données d'aujourd'hui
      const todayQuery = query(
        collection(db, 'rent_analytics'),
        where('date', '==', today)
      );
      
      const todaySnapshot = await getDocs(todayQuery);
      
      // Calcul des visiteurs uniques et pages vues
      const uniqueVisitorsToday = new Set<string>();
      let pageViewsToday = 0;
      let contactRequestsToday = 0;
      
      todaySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'page_view') {
          uniqueVisitorsToday.add(data.userAgent);
          pageViewsToday++;
        } else if (data.type === 'contact_request') {
          contactRequestsToday++;
        }
      });

      // Récupération des données de la semaine pour le graphique
      const weekDates = [];
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weekDates.push({
          date: date.toISOString().split('T')[0],
          name: dayNames[date.getDay()]
        });
      }

      const weeklyVisitors = await Promise.all(
        weekDates.map(async ({ date, name }) => {
          const dayQuery = query(
            collection(db, 'rent_analytics'),
            where('type', '==', 'page_view'),
            where('date', '==', date)
          );
          
          const daySnapshot = await getDocs(dayQuery);
          const uniqueVisitors = new Set<string>();
          
          daySnapshot.forEach(doc => {
            const data = doc.data();
            uniqueVisitors.add(data.userAgent);
          });
          
          return {
            name,
            visitors: uniqueVisitors.size
          };
        })
      );

      const newData = {
        visitorsToday: uniqueVisitorsToday.size,
        pageViews: pageViewsToday,
        contactRequests: contactRequestsToday,
        weeklyVisitors
      };

      setAnalyticsData(newData);
      setHasRealData(todaySnapshot.size > 0);
      setPermissionError(false); // Reset l'erreur de permission si succès
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des analytics:', error);
      
      if (error.code === 'permission-denied') {
        console.log('🔒 Erreur de permissions pour les analytics - utilisation des données de démo');
        setPermissionError(true);
        
        // Données de démonstration en cas d'erreur de permissions
        setAnalyticsData({
          visitorsToday: 42,
          pageViews: 156,
          contactRequests: 8,
          weeklyVisitors: [
            { name: 'Dim', visitors: 25 },
            { name: 'Lun', visitors: 45 },
            { name: 'Mar', visitors: 67 },
            { name: 'Mer', visitors: 54 },
            { name: 'Jeu', visitors: 89 },
            { name: 'Ven', visitors: 76 },
            { name: 'Sam', visitors: 42 }
          ]
        });
        setHasRealData(false);
      } else {
        // Autres erreurs - données de démonstration génériques
        setAnalyticsData({
          visitorsToday: 147,
          pageViews: 1234,
          contactRequests: 12,
          weeklyVisitors: [
            { name: 'Dim', visitors: 45 },
            { name: 'Lun', visitors: 78 },
            { name: 'Mar', visitors: 92 },
            { name: 'Mer', visitors: 67 },
            { name: 'Jeu', visitors: 147 },
            { name: 'Ven', visitors: 134 },
            { name: 'Sam', visitors: 89 }
          ]
        });
        setHasRealData(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !user) return;

    // Fetch initial data
    fetchAnalyticsData();

    // Set up interval for auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalyticsData, user]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  return {
    analyticsData,
    isLoading,
    hasRealData,
    autoRefresh,
    permissionError,
    fetchAnalyticsData,
    toggleAutoRefresh,
    trackPageView,
    trackContactRequest
  };
};
