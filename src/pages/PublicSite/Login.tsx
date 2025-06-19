
import React, { useEffect } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import LoginForm from '@/components/PublicSite/LoginForm';

const PublicLogin = () => {
  const { trackPageView } = useAnalyticsTracking();

  useEffect(() => {
    trackPageView('/login');
  }, [trackPageView]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </PublicLayout>
  );
};

export default PublicLogin;
