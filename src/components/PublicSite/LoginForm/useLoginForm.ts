
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userProfile, userType } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Tentative de connexion pour:', email);
      
      // Cas spécial pour l'admin
      if (email === 'admin@neotech-consulting.com') {
        try {
          // Essayer d'abord de se connecter normalement
          await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Admin connecté directement');
        } catch (loginError: any) {
          console.log('⚠️ Erreur de connexion admin:', loginError.code);
          
          // Si le compte n'existe pas, le créer
          if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/invalid-credential') {
            console.log('🔧 Création du compte admin...');
            try {
              await createUserWithEmailAndPassword(auth, email, password);
              console.log('✅ Compte admin créé avec succès');
            } catch (createError: any) {
              if (createError.code === 'auth/email-already-in-use') {
                // Le compte existe, réessayer la connexion avec un mot de passe par défaut
                try {
                  await signInWithEmailAndPassword(auth, email, 'admin123');
                  console.log('✅ Connexion admin avec mot de passe par défaut');
                } catch (defaultError) {
                  throw loginError; // Utiliser l'erreur originale
                }
              } else {
                throw createError;
              }
            }
          } else {
            throw loginError;
          }
        }
        
        toast({
          title: "Connexion administrateur",
          description: "Bienvenue dans l'interface d'administration",
        });
        
        // Redirection immédiate vers l'admin
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      
      // Pour les autres utilisateurs
      await login(email, password);
      console.log('✅ Connexion Firebase réussie pour:', email);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userProfile?.name || email}`,
      });

      // Attendre un peu pour que l'auth se stabilise puis rediriger
      setTimeout(() => {
        console.log('📊 Redirection - userType:', userType, 'userProfile:', userProfile);
        
        const from = location.state?.from?.pathname;
        
        // Redirection basée sur l'email ou le type d'utilisateur
        if (email === 'admin@neotech-consulting.com') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userType === 'admin') {
          navigate(from && from.startsWith('/admin') ? from : '/admin/dashboard', { replace: true });
        } else if (userType === 'owner' || userProfile?.isOwner) {
          navigate('/owner-space-lionel-rostand', { replace: true });
        } else if (userType === 'colocataire' || userType === 'locataire') {
          navigate('/tenant-space', { replace: true });
        } else {
          // Par défaut, si on ne peut pas déterminer le type, rediriger vers l'espace propriétaire
          console.log('⚠️ Type utilisateur non déterminé, redirection vers owner-space');
          navigate('/owner-space-lionel-rostand', { replace: true });
        }
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      
      let errorMessage = "Email ou mot de passe incorrect.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Aucun compte trouvé avec cette adresse email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Mot de passe incorrect.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Adresse email invalide.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "Ce compte a été désactivé.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard.";
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
        errorMessage = "Identifiants invalides. Vérifiez votre email et mot de passe.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    showRegistration,
    setShowRegistration,
    handleSubmit
  };
};
