
import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitorsToday: 0,
    pageViews: 0,
    contactRequests: 0,
    weeklyVisitors: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasRealData, setHasRealData] = useState(false);

  const trackPageView = useCallback(async (page: string, userAgent?: string) => {
    try {
      await addDoc(collection(db, 'website_analytics'), {
        type: 'page_view',
        page: page,
        timestamp: Timestamp.now(),
        userAgent: userAgent || navigator.userAgent,
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Erreur lors du tracking de page:', error);
    }
  }, []);

  const trackContactRequest = useCallback(async (contactType: string) => {
    try {
      await addDoc(collection(db, 'website_analytics'), {
        type: 'contact_request',
        contactType: contactType,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Erreur lors du tracking de contact:', error);
    }
  }, []);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Récupération des données d'aujourd'hui
      const todayQuery = query(
        collection(db, 'website_analytics'),
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
            collection(db, 'website_analytics'),
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
      
    } catch (error) {
      console.error('Erreur lors de la récupération des analytics:', error);
      // Données de démonstration en cas d'erreur
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyticsData,
    isLoading,
    hasRealData,
    fetchAnalyticsData,
    trackPageView,
    trackContactRequest
  };
};
