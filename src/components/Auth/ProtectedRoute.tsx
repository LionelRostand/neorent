
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserTypes?: ('admin' | 'employee' | 'locataire' | 'colocataire')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserTypes 
}) => {
  const { user, loading, userType, getDefaultRoute } = useAuth();
  const location = useLocation();

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

  // Rediriger vers login si pas connecté
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si des types d'utilisateur sont requis, vérifier les permissions
  if (requiredUserTypes && requiredUserTypes.length > 0) {
    if (!userType) {
      // Si pas de type d'utilisateur défini, rediriger vers login
      return <Navigate to="/login" replace />;
    }
    
    if (!requiredUserTypes.includes(userType)) {
      // Rediriger vers la route par défaut basée sur le type d'utilisateur
      const defaultRoute = getDefaultRoute();
      return <Navigate to={defaultRoute} replace />;
    }
  }

  // Rendre les enfants si tout est OK
  return <>{children}</>;
};

export default ProtectedRoute;
