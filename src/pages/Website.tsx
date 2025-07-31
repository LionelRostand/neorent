
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
      <div className="w-full h-full overflow-hidden">
        <div className="h-full flex flex-col space-y-3 md:space-y-4">
          <div className="bg-card rounded-lg shadow-sm border p-3 sm:p-4 md:p-6 flex-shrink-0">
            <div className="flex items-start space-x-3">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary flex-shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground break-words">{t('website.title')}</h1>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base break-words">
                  {t('website.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              {/* Mobile responsive tabs with horizontal scroll */}
              <div className="w-full overflow-x-auto scrollbar-hide flex-shrink-0">
                <TabsList className="inline-flex h-auto w-max min-w-full p-1 bg-muted rounded-lg mb-3 md:mb-4">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex flex-col items-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 md:py-3 text-xs font-medium whitespace-nowrap min-w-[60px] sm:min-w-[70px] md:min-w-[90px] lg:min-w-[100px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                      <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-tight text-center">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="pages" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <PagesTab />
                </TabsContent>

                <TabsContent value="immo" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <ImmoTab />
                </TabsContent>

                <TabsContent value="content" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <ContentTab />
                </TabsContent>

                <TabsContent value="medias" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <MediasTab />
                </TabsContent>

                <TabsContent value="theme" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <ThemeTab />
                </TabsContent>

                <TabsContent value="footer" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <FooterTab />
                </TabsContent>

                <TabsContent value="legal" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <LegalPagesTab />
                </TabsContent>

                <TabsContent value="cookies" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <CookiesTab />
                </TabsContent>

                <TabsContent value="carte" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <MapTab />
                </TabsContent>

                <TabsContent value="analytics" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <AnalyticsTab />
                </TabsContent>

                <TabsContent value="config" className="h-full overflow-y-auto scrollbar-hide p-2 md:p-4">
                  <ConfigTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Website;
