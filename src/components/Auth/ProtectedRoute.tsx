
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
  const { user, loading, userType, userProfile } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute - user:', user?.email, 'userType:', userType, 'loading:', loading);
  console.log('🔐 ProtectedRoute - location:', location.pathname);

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

  // Vérification stricte pour les routes admin - SEUL l'admin peut y accéder
  if (location.pathname.startsWith('/admin')) {
    const isStrictAdmin = user?.email === 'admin@neotech-consulting.com';
    
    if (!isStrictAdmin) {
      console.log('🔐 Accès admin STRICTEMENT refusé pour:', user?.email);
      
      // Rediriger les propriétaires vers leur espace personnel
      if (userType === 'owner' || !userType) {
        return <Navigate to="/owner-space-lionel-rostand" replace />;
      }
      
      // Rediriger les locataires vers leur espace
      if (userType === 'colocataire' || userType === 'locataire') {
        return <Navigate to="/tenant-space" replace />;
      }
      
      // Pour les autres, retour au login
      return <Navigate to="/login" replace />;
    }
  }

  // Vérification pour les espaces propriétaires personnalisés
  if (location.pathname.startsWith('/owner-space')) {
    const isAdmin = user?.email === 'admin@neotech-consulting.com';
    
    // L'admin peut toujours accéder
    if (isAdmin) {
      console.log('🔐 Accès admin autorisé à l\'espace propriétaire');
      return <>{children}</>;
    }
    
    // Pour les propriétaires : permettre l'accès si c'est leur compte ou s'ils ne sont pas encore typés
    const isOwnerAccount = userType === 'owner' || userProfile?.isOwner || userProfile?.role === 'owner';
    const isPotentialOwner = !userType || userType === 'owner'; // Si pas encore typé, considérer comme propriétaire potentiel
    
    console.log('🔐 Vérification accès owner-space:', {
      isOwnerAccount,
      isPotentialOwner,
      userType,
      userEmail: user?.email,
      pathname: location.pathname
    });
    
    if (isOwnerAccount || isPotentialOwner) {
      console.log('🔐 Accès autorisé à l\'espace propriétaire pour:', user?.email);
      return <>{children}</>;
    }
    
    console.log('🔐 Accès espace propriétaire refusé pour:', userType);
    
    if (userType === 'colocataire' || userType === 'locataire') {
      return <Navigate to="/tenant-space" replace />;
    }
    
    return <Navigate to="/login" replace />;
  }

  // Vérification des types d'utilisateur requis
  if (requiredUserTypes && requiredUserTypes.length > 0) {
    if (!loading && !userType) {
      console.log('🔐 Pas de type d\'utilisateur défini, considérer comme propriétaire potentiel');
      // Si pas de type défini, permettre l'accès pour owner
      if (requiredUserTypes.includes('owner')) {
        console.log('🔐 Accès owner autorisé pour utilisateur non typé');
        return <>{children}</>;
      }
      return <Navigate to="/login" replace />;
    }
    
    // Vérification stricte pour admin
    if (requiredUserTypes.includes('admin')) {
      const isStrictAdmin = user?.email === 'admin@neotech-consulting.com';
      if (!isStrictAdmin) {
        console.log('🔐 Accès admin strictement refusé');
        return <Navigate to="/login" replace />;
      }
    }
    
    // Vérification pour propriétaire - permettre à l'admin et aux propriétaires
    else if (requiredUserTypes.includes('owner')) {
      const isOwner = userType === 'owner' || userProfile?.isOwner || userProfile?.role === 'owner';
      const isAdmin = user?.email === 'admin@neotech-consulting.com';
      const isPotentialOwner = !userType; // Si pas de type, considérer comme propriétaire potentiel
      
      if (!isOwner && !isAdmin && !isPotentialOwner) {
        console.log('🔐 Accès propriétaire refusé:', userType);
        if (userType === 'locataire' || userType === 'colocataire') {
          return <Navigate to="/tenant-space" replace />;
        }
        return <Navigate to="/login" replace />;
      }
    }
    
    // Autres vérifications de type
    else if (userType && !requiredUserTypes.includes(userType)) {
      console.log('🔐 Type d\'utilisateur non autorisé:', userType, 'requis:', requiredUserTypes);
      
      if (userType === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (userType === 'owner') {
        return <Navigate to="/owner-space-lionel-rostand" replace />;
      } else if (userType === 'locataire' || userType === 'colocataire') {
        return <Navigate to="/tenant-space" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  // Rendre les enfants seulement si tout est OK et que le loading est terminé
  if (!loading && user) {
    console.log('🔐 Accès autorisé pour:', user.email, 'sur:', location.pathname);
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
