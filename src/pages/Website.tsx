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
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6 flex-shrink-0 mb-4">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t('website.title')}</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {t('website.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Content area with tabs */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Main content area */}
            <div className="flex-1 overflow-hidden min-h-0">
              <TabsContent value="pages" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <PagesTab />
              </TabsContent>

              <TabsContent value="immo" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <ImmoTab />
              </TabsContent>

              <TabsContent value="content" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <ContentTab />
              </TabsContent>

              <TabsContent value="medias" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <MediasTab />
              </TabsContent>

              <TabsContent value="theme" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <ThemeTab />
              </TabsContent>

              <TabsContent value="footer" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <FooterTab />
              </TabsContent>

              <TabsContent value="legal" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <LegalPagesTab />
              </TabsContent>

              <TabsContent value="cookies" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <CookiesTab />
              </TabsContent>

              <TabsContent value="carte" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <MapTab />
              </TabsContent>

              <TabsContent value="analytics" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="config" className="h-full overflow-y-auto data-[state=inactive]:hidden">
                <ConfigTab />
              </TabsContent>
            </div>

            {/* Bottom tabs for mobile - Fixed at bottom */}
            <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="w-full overflow-x-auto">
                <TabsList className="w-full h-auto p-2 bg-transparent justify-start min-w-max">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium whitespace-nowrap min-w-[65px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-none rounded-lg transition-all"
                    >
                      <tab.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-[10px] leading-tight text-center">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Website;