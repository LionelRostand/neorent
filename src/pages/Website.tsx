
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
      <div className="h-screen flex flex-col">
        {/* Header Section */}
        <div className="bg-card rounded-lg shadow-sm border p-4 md:p-6 m-4 md:m-6 flex-shrink-0">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{t('website.title')}</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {t('website.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area with Mobile Bottom Tabs */}
        <div className="flex-1 flex flex-col md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col md:block">
            {/* Desktop Tabs - Top */}
            <div className="hidden md:block px-6 mb-4">
              <TabsList className="inline-flex h-auto w-max p-1 bg-muted rounded-lg">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden px-4 md:px-6 pb-4 md:pb-6">
              <div className="h-full overflow-y-auto">
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

            {/* Mobile Tabs - Bottom */}
            <div className="md:hidden bg-background border-t p-2 flex-shrink-0">
              <div className="flex justify-around items-center">
                {tabs.slice(0, 4).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] ${
                      activeTab === tab.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Website;
