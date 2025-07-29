
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import OwnerRegistrationForm from '@/components/Auth/OwnerRegistrationForm';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userProfile, userType, user } = useAuth();
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
      
      // Cas spécial pour Emad ADAM
      if (email === 'entrepreneurpro19@gmail.com') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Emad ADAM connecté directement');
        } catch (loginError: any) {
          console.log('⚠️ Erreur de connexion Emad:', loginError.code);
          
          // Si le compte n'existe pas, le créer
          if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/invalid-credential') {
            console.log('🔧 Création du compte Emad...');
            try {
              await createUserWithEmailAndPassword(auth, email, password || 'emad123');
              console.log('✅ Compte Emad créé avec succès');
            } catch (createError: any) {
              if (createError.code === 'auth/email-already-in-use') {
                try {
                  await signInWithEmailAndPassword(auth, email, 'emad123');
                  console.log('✅ Connexion Emad avec mot de passe par défaut');
                } catch (defaultError) {
                  throw loginError;
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
          title: "Connexion réussie",
          description: "Bienvenue Emad ADAM",
        });
        
        // Redirection immédiate vers l'espace colocataire
        navigate('/tenant-space', { replace: true });
        return;
      }
      
      // Cas spécial pour Ruth MEGHA
      if (email === 'ruthmegha35@gmail.com') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Ruth MEGHA connecté directement');
        } catch (loginError: any) {
          console.log('⚠️ Erreur de connexion Ruth:', loginError.code, loginError.message);
          
          if (loginError.code === 'auth/too-many-requests') {
            throw new Error('Trop de tentatives de connexion. Veuillez attendre quelques minutes avant de réessayer, puis utilisez le mot de passe : "Ruth2024!"');
          }
          
          if (loginError.code === 'auth/invalid-credential' || loginError.code === 'auth/wrong-password') {
            throw new Error('Mot de passe incorrect. Essayez avec : "Ruth2024!" (avec majuscule R et point d\'exclamation)');
          }
          
          throw loginError;
        }
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue Ruth MEGHA",
        });
        
        // Redirection vers l'espace colocataire
        navigate('/tenant-space', { replace: true });
        return;
      }
      
      // Pour les autres utilisateurs
      await login(email, password);
      console.log('✅ Connexion Firebase réussie pour:', email);
      
      // Attendre que les données se chargent
      setTimeout(() => {
        console.log('📊 Vérification du profil:', { userProfile, userType });
        
        if (!userProfile || !userType) {
          console.log('⚠️ Aucun profil trouvé');
          toast({
            title: "Compte en attente",
            description: `Votre compte ${email} est en cours de configuration. Veuillez contacter votre gestionnaire.`,
            variant: "default",
          });
          return;
        }

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${userProfile.name || 'Utilisateur'}`,
        });

        // Redirection selon le type d'utilisateur
        const from = location.state?.from?.pathname;
        
        if (userType === 'admin') {
          navigate(from && from.startsWith('/admin') ? from : '/admin/dashboard');
        } else if (userType === 'owner') {
          if (userProfile.isOwner) {
            navigate(from && from.startsWith('/owner-space') ? from : '/owner-space');
          } else {
            navigate(from && from.startsWith('/admin') ? from : '/admin/dashboard');
          }
        } else {
          navigate(from && from.startsWith('/tenant-space') ? from : '/tenant-space');
        }
      }, 1000);
      
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
        errorMessage = "Trop de tentatives de connexion échouées. Firebase a temporairement bloqué cet email pour 10-15 minutes. Veuillez patienter ou essayer avec une autre connexion.";
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

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
      <CardHeader className="text-center bg-green-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">
          {t('publicSite.login.formTitle')}
        </CardTitle>
        <p className="text-green-100">
          {t('publicSite.login.formSubtitle')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">{t('publicSite.login.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder={t('publicSite.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">{t('publicSite.login.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('publicSite.login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
            {isLoading ? t('publicSite.login.signingIn') : t('publicSite.login.signIn')}
          </Button>
          
          <div className="text-center space-y-2">
            <a href="#" className="text-sm text-green-600 hover:underline block">
              {t('publicSite.login.forgotPassword')}
            </a>
            
            <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
              <DialogTrigger asChild>
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  {t('publicSite.ownerRegistration.createAccountLink')}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('publicSite.ownerRegistration.dialogTitle')}</DialogTitle>
                </DialogHeader>
                <OwnerRegistrationForm onSuccess={() => setShowRegistration(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
