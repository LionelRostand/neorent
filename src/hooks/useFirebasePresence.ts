import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, updateDoc, onSnapshot, serverTimestamp, deleteDoc } from 'firebase/firestore';
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
  const presenceRef = useRef<any>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fonction pour marquer l'utilisateur comme en ligne
  const setUserOnline = async (userId: string, name: string, email: string) => {
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

  // Écouter les changements de présence de tous les utilisateurs
  const subscribeToPresence = () => {
    try {
      // Créer une référence à la collection user_presence
      const presenceCollectionRef = doc(db, 'user_presence', 'all_users');
      
      // Pour écouter tous les utilisateurs, on va utiliser une approche différente
      // On va écouter chaque utilisateur individuellement
      const userIds = ['1752971742586', '1752971742587', 'admin-default']; // IDs des utilisateurs connus
      
      const unsubscribeFunctions: (() => void)[] = [];
      
      userIds.forEach(userId => {
        const userPresenceRef = doc(db, 'user_presence', userId);
        const unsubscribe = onSnapshot(userPresenceRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserPresence;
            
            setOnlineUsers(prev => ({
              ...prev,
              [userId]: userData
            }));
            
            console.log(`📱 Statut mis à jour pour ${userData.name}:`, userData.isOnline ? 'En ligne' : 'Hors ligne');
          } else {
            // L'utilisateur n'a pas de document de présence, on le considère comme hors ligne
            setOnlineUsers(prev => {
              const newState = { ...prev };
              if (newState[userId]) {
                newState[userId] = {
                  ...newState[userId],
                  isOnline: false,
                  lastSeen: new Date()
                };
              }
              return newState;
            });
          }
        }, (error) => {
          console.error(`Erreur lors de l'écoute de la présence pour ${userId}:`, error);
        });
        
        unsubscribeFunctions.push(unsubscribe);
      });
      
      // Retourner une fonction pour se désabonner de tous les listeners
      return () => {
        unsubscribeFunctions.forEach(unsub => unsub());
      };
      
    } catch (error) {
      console.error('Erreur lors de la souscription à la présence:', error);
      return () => {}; // Fonction vide en cas d'erreur
    }
  };

  // Gérer la présence de l'utilisateur actuel
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('🔄 Initialisation de la présence pour:', currentUser.name);
    
    // Marquer l'utilisateur comme en ligne au chargement
    setUserOnline(currentUser.id, currentUser.name, currentUser.email);
    
    // Mettre à jour périodiquement le statut en ligne (heartbeat)
    const heartbeatInterval = setInterval(() => {
      setUserOnline(currentUser.id, currentUser.name, currentUser.email);
    }, 30000); // Toutes les 30 secondes
    
    // Gérer la fermeture de la page/onglet
    const handleBeforeUnload = () => {
      setUserOffline(currentUser.id);
    };
    
    // Gérer les changements de visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserOffline(currentUser.id);
      } else {
        setUserOnline(currentUser.id, currentUser.name, currentUser.email);
      }
    };
    
    // Écouter les événements de fermeture/visibilité
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // S'abonner aux changements de présence
    const unsubscribePresence = subscribeToPresence();
    unsubscribeRef.current = unsubscribePresence;
    
    setLoading(false);
    
    // Nettoyage
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Marquer comme hors ligne avant de se déconnecter
      setUserOffline(currentUser.id);
      
      // Se désabonner des listeners
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentUser]);

  // Fonction pour obtenir le statut d'un utilisateur
  const getUserStatus = (userId: string) => {
    const user = onlineUsers[userId];
    if (!user) {
      return { isOnline: false, lastSeen: 'Inconnu' };
    }
    
    if (user.isOnline) {
      return { isOnline: true, lastSeen: 'En ligne' };
    }
    
    // Calculer le temps écoulé depuis la dernière fois vu
    if (user.lastSeen && user.lastSeen.toDate) {
      const lastSeenDate = user.lastSeen.toDate();
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMinutes < 1) {
        return { isOnline: false, lastSeen: 'À l\'instant' };
      } else if (diffMinutes < 60) {
        return { isOnline: false, lastSeen: `Vu il y a ${diffMinutes}min` };
      } else if (diffHours < 24) {
        return { isOnline: false, lastSeen: `Vu il y a ${diffHours}h` };
      } else {
        return { isOnline: false, lastSeen: `Vu il y a ${diffDays}j` };
      }
    }
    
    return { isOnline: false, lastSeen: 'Hors ligne' };
  };

  return {
    onlineUsers,
    loading,
    getUserStatus,
    setUserOnline,
    setUserOffline
  };
};