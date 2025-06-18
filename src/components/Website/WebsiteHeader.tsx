
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const WebsiteHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('website.websiteManagement')}</h1>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
          {t('website.subtitle')}
        </p>
      </div>
      <div className="flex gap-2">
        <Link to="/" target="_blank">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <ExternalLink className="h-4 w-4" />
            View website
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WebsiteHeader;
