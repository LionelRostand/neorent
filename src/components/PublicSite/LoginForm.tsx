
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, userProfile, userType } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Attendre un peu pour que les données Firebase se chargent
      setTimeout(() => {
        // Vérifier si l'utilisateur a un profil valide
        if (!userProfile) {
          toast({
            title: "Accès refusé",
            description: "Votre compte n'est pas encore configuré. Contactez votre gestionnaire immobilier.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${userProfile.name || 'Utilisateur'}`,
        });

        // Rediriger selon le type d'utilisateur
        if (userType === 'admin' || userType === 'employee') {
          navigate('/admin');
        } else {
          navigate('/tenant-space');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
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
          Connexion à Neo Rent
        </CardTitle>
        <p className="text-green-100">
          Accédez à votre espace de gestion immobilière
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
          
          <div className="text-center">
            <a href="#" className="text-sm text-green-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Vous êtes locataire ou colocataire ?</p>
            <p>Utilisez l'email et le mot de passe fournis par votre gestionnaire.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
