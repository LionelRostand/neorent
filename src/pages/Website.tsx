
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('pages');

  const tabs = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'content', label: 'Contenu', icon: File },
    { id: 'medias', label: 'Médias', icon: Image },
    { id: 'theme', label: 'Thème', icon: Palette },
    { id: 'footer', label: 'Pied de page', icon: LinkIcon },
    { id: 'carte', label: 'Carte', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <WebsiteHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 text-sm"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <PagesTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentTab />
          </TabsContent>

          <TabsContent value="medias" className="space-y-6">
            <MediasTab />
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <ThemeTab />
          </TabsContent>

          <TabsContent value="footer" className="space-y-6">
            <FooterTab />
          </TabsContent>

          <TabsContent value="carte" className="space-y-6">
            <MapTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <ConfigTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Website;
