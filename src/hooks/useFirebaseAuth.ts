
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useFirebaseAuth = () => {
  const createUserAccount = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Erreur lors de la création du compte:', error);
      
      // Gérer l'erreur spécifique d'email déjà utilisé
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Cet email est déjà utilisé. Veuillez utiliser un autre email ou connecter l\'utilisateur existant.');
      }
      
      // Autres erreurs d'authentification Firebase
      if (error.code === 'auth/weak-password') {
        throw new Error('Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('L\'adresse email n\'est pas valide.');
      }
      
      throw error;
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('Aucun utilisateur trouvé avec cet email.');
      }
      
      if (error.code === 'auth/wrong-password') {
        throw new Error('Mot de passe incorrect.');
      }
      
      if (error.code === 'auth/invalid-email') {
        throw new Error('L\'adresse email n\'est pas valide.');
      }
      
      throw error;
    }
  };

  return {
    createUserAccount,
    signInUser
  };
};
