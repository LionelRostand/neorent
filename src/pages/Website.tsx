
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
      <div className="h-full flex flex-col p-4 md:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 flex-shrink-0 mb-6">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {t('website.title')}
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed">
                {t('website.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Tabs - Responsive */}
            <div className="w-full overflow-x-auto scrollbar-hide mb-4">
              <TabsList className="inline-flex h-auto w-max p-1 bg-gray-100 rounded-lg">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium whitespace-nowrap min-w-[70px] sm:min-w-[80px] md:min-w-[90px] data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all text-gray-600 hover:text-gray-900"
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-[10px] lg:text-xs leading-tight text-center">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto bg-white rounded-lg shadow-sm border p-4">
                <TabsContent value="pages" className="m-0 h-full">
                  <PagesTab />
                </TabsContent>

                <TabsContent value="immo" className="m-0 h-full">
                  <ImmoTab />
                </TabsContent>

                <TabsContent value="content" className="m-0 h-full">
                  <ContentTab />
                </TabsContent>

                <TabsContent value="medias" className="m-0 h-full">
                  <MediasTab />
                </TabsContent>

                <TabsContent value="theme" className="m-0 h-full">
                  <ThemeTab />
                </TabsContent>

                <TabsContent value="footer" className="m-0 h-full">
                  <FooterTab />
                </TabsContent>

                <TabsContent value="legal" className="m-0 h-full">
                  <LegalPagesTab />
                </TabsContent>

                <TabsContent value="cookies" className="m-0 h-full">
                  <CookiesTab />
                </TabsContent>

                <TabsContent value="carte" className="m-0 h-full">
                  <MapTab />
                </TabsContent>

                <TabsContent value="analytics" className="m-0 h-full">
                  <AnalyticsTab />
                </TabsContent>

                <TabsContent value="config" className="m-0 h-full">
                  <ConfigTab />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Website;
