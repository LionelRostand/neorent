import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AutoRedirect = () => {
  const { userType, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && userType) {
      console.log('🔀 AutoRedirect - Redirecting user based on type:', userType);
      
      switch (userType) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'owner':
          navigate('/owner-space');
          break;
        case 'locataire':
        case 'colocataire':
          navigate('/tenant-space');
          break;
        default:
          console.log('🔀 Unknown user type, staying on current page');
          break;
      }
    }
  }, [userType, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AutoRedirect;