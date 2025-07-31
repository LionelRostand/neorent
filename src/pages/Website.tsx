
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
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
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('website.title')}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {t('website.description')}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile responsive tabs with horizontal scroll */}
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-auto min-w-full w-max p-1 bg-gray-100 rounded-lg mb-4 md:mb-6">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium whitespace-nowrap min-w-[80px] sm:min-w-[100px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-tight text-center">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="min-h-[600px]">
            <TabsContent value="pages" className="space-y-4 md:space-y-6 mt-0">
              <PagesTab />
            </TabsContent>

            <TabsContent value="immo" className="space-y-4 md:space-y-6 mt-0">
              <ImmoTab />
            </TabsContent>

            <TabsContent value="content" className="space-y-4 md:space-y-6 mt-0">
              <ContentTab />
            </TabsContent>

            <TabsContent value="medias" className="space-y-4 md:space-y-6 mt-0">
              <MediasTab />
            </TabsContent>

            <TabsContent value="theme" className="space-y-4 md:space-y-6 mt-0">
              <ThemeTab />
            </TabsContent>

            <TabsContent value="footer" className="space-y-4 md:space-y-6 mt-0">
              <FooterTab />
            </TabsContent>

            <TabsContent value="legal" className="space-y-4 md:space-y-6 mt-0">
              <LegalPagesTab />
            </TabsContent>

            <TabsContent value="cookies" className="space-y-4 md:space-y-6 mt-0">
              <CookiesTab />
            </TabsContent>

            <TabsContent value="carte" className="space-y-4 md:space-y-6 mt-0">
              <MapTab />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 md:space-y-6 mt-0">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="config" className="space-y-4 md:space-y-6 mt-0">
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
    </MainLayout>
  );
};

export default Website;
