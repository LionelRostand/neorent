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

const LoginForm = () => {
  const { t } = useTranslation();
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
      await login(email, password);
      
      console.log('✅ Connexion Firebase réussie');
      
      // Attendre que les données se chargent
      setTimeout(() => {
        console.log('📊 Vérification du profil:', { userProfile, userType, email });
        
        // Si aucun profil n'est trouvé, rediriger vers une page d'attente
        if (!userProfile || !userType) {
          console.log('⚠️ Aucun profil trouvé, redirection vers la page d\'attente');
          toast({
            title: "Compte en attente",
            description: `Votre compte ${email} est en cours de configuration. Veuillez contacter votre gestionnaire.`,
            variant: "default",
          });
          
          // Rediriger vers une page neutre ou rester sur login
          navigate('/login');
          return;
        }

        console.log('✅ Profil trouvé:', userProfile);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${userProfile.name || 'Utilisateur'}`,
        });

        // Récupérer l'URL de redirection
        const from = location.state?.from?.pathname || null;
        
        // Rediriger selon le type d'utilisateur
        if (userType === 'admin' || userType === 'employee') {
          if (from && from.startsWith('/admin')) {
            navigate(from);
          } else {
            navigate('/admin');
          }
        } else {
          if (from && from.startsWith('/tenant-space')) {
            navigate(from);
          } else {
            navigate('/tenant-space');
          }
        }
      }, 2000);
      
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
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Identifiants invalides. Vérifiez votre email et mot de passe.";
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
