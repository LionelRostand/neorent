
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  File, 
  Image, 
  Palette, 
  MapPin, 
  BarChart3, 
  Settings,
  Link as LinkIcon,
  Home,
  Scale
} from 'lucide-react';

import WebsiteHeader from '@/components/Website/WebsiteHeader';
import PagesTab from '@/components/Website/PagesTab';
import ContentTab from '@/components/Website/ContentTab';
import MediasTab from '@/components/Website/MediasTab';
import ThemeTab from '@/components/Website/ThemeTab';
import FooterTab from '@/components/Website/FooterTab';
import MapTab from '@/components/Website/MapTab';
import AnalyticsTab from '@/components/Website/AnalyticsTab';
import ConfigTab from '@/components/Website/ConfigTab';
import CookiesTab from '@/components/Website/CookiesTab';
import ImmoTab from '@/components/Website/ImmoTab';
import LegalPagesTab from '@/components/Website/LegalPagesTab';

const Website = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('pages');

  const tabs = [
    { id: 'pages', label: t('website.managePages'), icon: FileText },
    { id: 'immo', label: 'Immo', icon: Home },
    { id: 'content', label: t('website.editContent'), icon: File },
    { id: 'medias', label: t('website.photoGallery'), icon: Image },
    { id: 'theme', label: t('common.theme'), icon: Palette },
    { id: 'footer', label: t('common.footer'), icon: LinkIcon },
    { id: 'legal', label: 'Pages légales', icon: Scale },
    { id: 'cookies', label: 'Cookies', icon: Settings },
    { id: 'carte', label: t('common.map'), icon: MapPin },
    { id: 'analytics', label: t('common.analytics'), icon: BarChart3 },
    { id: 'config', label: t('common.config'), icon: Settings }
  ];

  return (
    <AdminLayout>
      <div className="w-full max-w-full overflow-hidden space-y-4 md:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">{t('website.title')}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                {t('website.description')}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile responsive tabs with horizontal scroll */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-auto w-max min-w-full p-1 bg-gray-100 rounded-lg mb-4 md:mb-6">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col items-center gap-1 px-2 sm:px-3 py-2 sm:py-3 text-xs font-medium whitespace-nowrap min-w-[70px] sm:min-w-[90px] md:min-w-[100px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs leading-tight text-center">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            <TabsContent value="pages" className="space-y-4 md:space-y-6 mt-0 w-full">
              <PagesTab />
            </TabsContent>

            <TabsContent value="immo" className="space-y-4 md:space-y-6 mt-0 w-full">
              <ImmoTab />
            </TabsContent>

            <TabsContent value="content" className="space-y-4 md:space-y-6 mt-0 w-full">
              <ContentTab />
            </TabsContent>

            <TabsContent value="medias" className="space-y-4 md:space-y-6 mt-0 w-full">
              <MediasTab />
            </TabsContent>

            <TabsContent value="theme" className="space-y-4 md:space-y-6 mt-0 w-full">
              <ThemeTab />
            </TabsContent>

            <TabsContent value="footer" className="space-y-4 md:space-y-6 mt-0 w-full">
              <FooterTab />
            </TabsContent>

            <TabsContent value="legal" className="space-y-4 md:space-y-6 mt-0 w-full">
              <LegalPagesTab />
            </TabsContent>

            <TabsContent value="cookies" className="space-y-4 md:space-y-6 mt-0 w-full">
              <CookiesTab />
            </TabsContent>

            <TabsContent value="carte" className="space-y-4 md:space-y-6 mt-0 w-full">
              <MapTab />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 md:space-y-6 mt-0 w-full">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="config" className="space-y-4 md:space-y-6 mt-0 w-full">
              <ConfigTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </AdminLayout>
  );
};

export default Website;
