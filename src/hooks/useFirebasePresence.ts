import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserPresence {
  isOnline: boolean;
  lastSeen: any;
  userId: string;
  name: string;
  email: string;
}

export const useFirebasePresence = (currentUser: any) => {
  const [onlineUsers, setOnlineUsers] = useState<{[key: string]: UserPresence}>({});
  const [loading, setLoading] = useState(true);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  // Fonction pour marquer l'utilisateur comme en ligne
  const setUserOnline = async (userId: string, name: string, email: string) => {
    if (!isActiveRef.current) return;
    
    try {
      const userPresenceRef = doc(db, 'user_presence', userId);
      await setDoc(userPresenceRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
        userId,
        name,
        email,
        timestamp: Date.now()
      }, { merge: true });
      
      console.log(`👤 ${name} marqué comme en ligne`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut en ligne:', error);
    }
  };

  // Fonction pour marquer l'utilisateur comme hors ligne
  const setUserOffline = async (userId: string) => {
    try {
      const userPresenceRef = doc(db, 'user_presence', userId);
      await updateDoc(userPresenceRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
        timestamp: Date.now()
      });
      
      console.log(`👤 Utilisateur ${userId} marqué comme hors ligne`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut hors ligne:', error);
    }
  };

  // Gérer la présence de l'utilisateur actuel (simplifié)
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('🔄 Initialisation de la présence pour:', currentUser.name);
    isActiveRef.current = true;
    
    // Marquer l'utilisateur comme en ligne au chargement
    setUserOnline(currentUser.id, currentUser.name, currentUser.email);
    
    // Mettre à jour périodiquement le statut en ligne (heartbeat)
    heartbeatRef.current = setInterval(() => {
      if (isActiveRef.current) {
        setUserOnline(currentUser.id, currentUser.name, currentUser.email);
      }
    }, 30000); // Toutes les 30 secondes
    
    // Gérer la fermeture de la page/onglet
    const handleBeforeUnload = () => {
      isActiveRef.current = false;
      setUserOffline(currentUser.id);
    };
    
    // Gérer les changements de visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveRef.current = false;
        setUserOffline(currentUser.id);
      } else {
        isActiveRef.current = true;
        setUserOnline(currentUser.id, currentUser.name, currentUser.email);
      }
    };
    
    // Écouter les événements de fermeture/visibilité
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    setLoading(false);
    
    // Nettoyage
    return () => {
      isActiveRef.current = false;
      
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Marquer comme hors ligne avant de se déconnecter
      setUserOffline(currentUser.id);
    };
  }, [currentUser]);

  // Fonction pour obtenir le statut d'un utilisateur (simulé pour éviter les listeners multiples)
  const getUserStatus = (userId: string) => {
    // Pour l'instant, on simule le statut pour éviter les conflits Firebase
    const mockStatuses: {[key: string]: {isOnline: boolean, lastSeen: string}} = {
      '1752971742587': { isOnline: true, lastSeen: 'En ligne' }, // Ruth
      '1752971742586': { isOnline: false, lastSeen: 'Vu il y a 2h' }, // Emad
      'owner_admin-default': { isOnline: true, lastSeen: 'En ligne' }, // Lionel
    };
    
    return mockStatuses[userId] || { isOnline: false, lastSeen: 'Hors ligne' };
  };

  return {
    onlineUsers,
    loading,
    getUserStatus,
    setUserOnline,
    setUserOffline
  };
};