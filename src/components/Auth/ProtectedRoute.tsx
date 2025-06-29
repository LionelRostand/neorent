
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

  // Fonction utilitaire pour générer l'URL de l'espace propriétaire
  const getOwnerSpaceUrl = (ownerName: string) => {
    const cleanName = ownerName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `/owner-space-${cleanName}`;
  };

  // Redirection automatique selon le type d'utilisateur après connexion
  if (user && !loading) {
    const isAdmin = user.email === 'admin@neotech-consulting.com';
    
    // Si c'est un propriétaire sur la page de login, le rediriger vers son espace
    if (location.pathname === '/login' && userType === 'owner' && !isAdmin) {
      const ownerName = userProfile?.name || user.displayName || user.email?.split('@')[0] || 'owner';
      const ownerSpaceUrl = getOwnerSpaceUrl(ownerName);
      console.log('🔐 Redirection propriétaire vers:', ownerSpaceUrl);
      return <Navigate to={ownerSpaceUrl} replace />;
    }

    // Si c'est l'admin sur la page de login, le rediriger vers l'admin
    if (location.pathname === '/login' && isAdmin) {
      console.log('🔐 Redirection admin vers /admin');
      return <Navigate to="/admin" replace />;
    }
  }

  // Vérification stricte pour les routes admin - SEUL l'admin peut y accéder
  if (location.pathname.startsWith('/admin')) {
    const isStrictAdmin = user?.email === 'admin@neotech-consulting.com';
    
    if (!isStrictAdmin) {
      console.log('🔐 Accès admin STRICTEMENT refusé pour:', user?.email);
      
      // Rediriger les propriétaires vers leur espace personnel
      if (userType === 'owner') {
        const ownerName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'owner';
        const ownerSpaceUrl = getOwnerSpaceUrl(ownerName);
        return <Navigate to={ownerSpaceUrl} replace />;
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
  if (location.pathname.includes('/owner-space')) {
    const isOwner = userType === 'owner' || userProfile?.isOwner || userProfile?.role === 'owner';
    const isAdmin = user?.email === 'admin@neotech-consulting.com';
    
    console.log('🔐 Vérification accès owner-space:', {
      isOwner,
      isAdmin,
      userType,
      pathname: location.pathname
    });
    
    if (!isOwner && !isAdmin) {
      console.log('🔐 Accès espace propriétaire refusé pour:', userType);
      
      if (userType === 'colocataire' || userType === 'locataire') {
        return <Navigate to="/tenant-space" replace />;
      }
      
      return <Navigate to="/login" replace />;
    }

    // Pour les propriétaires, vérifier qu'ils accèdent à leur propre espace (sauf admin)
    if (isOwner && !isAdmin) {
      const ownerName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'owner';
      const expectedUrl = getOwnerSpaceUrl(ownerName);
      
      console.log('🔐 Vérification URL propriétaire:', {
        currentPath: location.pathname,
        expectedUrl,
        ownerName
      });
      
      // Si l'URL ne correspond pas exactement, rediriger vers la bonne URL
      if (location.pathname !== expectedUrl) {
        console.log('🔐 Redirection propriétaire vers son espace personnel:', expectedUrl);
        return <Navigate to={expectedUrl} replace />;
      }
    }
  }

  // Vérification des types d'utilisateur requis
  if (requiredUserTypes && requiredUserTypes.length > 0) {
    if (!loading && !userType) {
      console.log('🔐 Pas de type d\'utilisateur défini après chargement');
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
    
    // Vérification pour propriétaire
    else if (requiredUserTypes.includes('owner')) {
      const isOwner = userType === 'owner' || userProfile?.isOwner || userProfile?.role === 'owner';
      
      if (!isOwner) {
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
        const ownerName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'owner';
        const ownerSpaceUrl = getOwnerSpaceUrl(ownerName);
        return <Navigate to={ownerSpaceUrl} replace />;
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
