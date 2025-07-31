
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserTypes?: ('admin' | 'owner' | 'locataire' | 'colocataire')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserTypes 
}) => {
  const { user, loading, userType } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute - user:', user?.email, 'userType:', userType, 'loading:', loading);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login seulement si le loading est terminé ET qu'il n'y a pas d'utilisateur
  if (!loading && !user) {
    console.log('🔐 Pas d\'utilisateur connecté, redirection vers /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cas spécial pour l'admin - toujours autoriser l'accès
  if (user?.email === 'admin@neotech-consulting.com') {
    console.log('🔐 Admin connecté, accès autorisé');
    return <>{children}</>;
  }

  // Vérification spécifique pour les pages admin - seuls admin et owner sont autorisés
  if (location.pathname.startsWith('/admin')) {
    if (userType !== 'admin' && userType !== 'owner') {
      console.log('🔐 Accès admin refusé pour:', userType, 'redirection vers espace approprié');
      
      // Rediriger les colocataires et locataires vers leur espace
      if (userType === 'colocataire' || userType === 'locataire') {
        return <Navigate to="/tenant-space" replace />;
      }
      
      // Pour les autres types non autorisés
      return <Navigate to="/login" replace />;
    }
  }

  // Vérification spécifique pour l'espace propriétaires - admins et owners autorisés
  if (location.pathname.startsWith('/owner-space')) {
    if (userType !== 'admin' && userType !== 'owner') {
      console.log('🔐 Accès espace propriétaires refusé pour:', userType);
      
      // Rediriger les colocataires et locataires vers leur espace
      if (userType === 'colocataire' || userType === 'locataire') {
        return <Navigate to="/tenant-space" replace />;
      }
      
      // Pour les autres types non autorisés
      return <Navigate to="/login" replace />;
    }
  }

  // Si des types d'utilisateur sont requis, vérifier les permissions
  if (requiredUserTypes && requiredUserTypes.length > 0) {
    // Attendre que userType soit chargé avant de vérifier les permissions
    if (!loading && !userType) {
      console.log('🔐 Pas de type d\'utilisateur défini après chargement');
      return <Navigate to="/login" replace />;
    }
    
    // Si userType est chargé mais ne correspond pas aux permissions requises
    if (userType && !requiredUserTypes.includes(userType)) {
      console.log('🔐 Type d\'utilisateur non autorisé:', userType, 'requis:', requiredUserTypes);
      // Rediriger selon le type d'utilisateur
      if (userType === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (userType === 'owner') {
        return <Navigate to="/owner-space" replace />;
      } else if (userType === 'locataire' || userType === 'colocataire') {
        return <Navigate to="/tenant-space" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  // Redirection automatique des propriétaires vers leur espace
  if (userType === 'owner' && location.pathname === '/tenant-space') {
    console.log('🔐 Propriétaire redirigé vers owner-space depuis tenant-space');
    return <Navigate to="/owner-space" replace />;
  }

  // Redirection automatique des locataires/colocataires vers leur espace  
  if ((userType === 'locataire' || userType === 'colocataire') && location.pathname === '/owner-space') {
    console.log('🔐 Locataire/Colocataire redirigé vers tenant-space depuis owner-space');
    return <Navigate to="/tenant-space" replace />;
  }

  // Rendre les enfants seulement si tout est OK et que le loading est terminé
  if (!loading && user) {
    console.log('🔐 Accès autorisé pour:', user.email);
    return <>{children}</>;
  }

  // Afficher le loader par défaut si on arrive ici
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
