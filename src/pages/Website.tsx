
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
  Link as LinkIcon
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

const Website = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('pages');

  const tabs = [
    { id: 'pages', label: t('website.managePages'), icon: FileText },
    { id: 'content', label: t('website.editContent'), icon: File },
    { id: 'medias', label: t('website.photoGallery'), icon: Image },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'footer', label: 'Footer', icon: LinkIcon },
    { id: 'carte', label: 'Map', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'config', label: 'Config', icon: Settings }
  ];

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <WebsiteHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-[640px] grid-cols-8 mb-4 md:mb-6 mx-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate text-[10px] sm:text-xs lg:text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="pages" className="space-y-4 md:space-y-6">
            <PagesTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-4 md:space-y-6">
            <ContentTab />
          </TabsContent>

          <TabsContent value="medias" className="space-y-4 md:space-y-6">
            <MediasTab />
          </TabsContent>

          <TabsContent value="theme" className="space-y-4 md:space-y-6">
            <ThemeTab />
          </TabsContent>

          <TabsContent value="footer" className="space-y-4 md:space-y-6">
            <FooterTab />
          </TabsContent>

          <TabsContent value="carte" className="space-y-4 md:space-y-6">
            <MapTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="config" className="space-y-4 md:space-y-6">
            <ConfigTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Website;
