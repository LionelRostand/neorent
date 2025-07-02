
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Users } from 'lucide-react';
import { useState } from 'react';

const TenantResponsibilities = () => {
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const responsibilityCategories = [
    {
      key: 'currentMaintenance',
      title: t('maintenanceResponsibilities.responsibilityGuide.currentMaintenance'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.regularHouseholdCleaning'),
        t('maintenanceResponsibilities.responsibilityGuide.siliconeJointsMaintenance'),
        t('maintenanceResponsibilities.responsibilityGuide.windowCleaning'),
        t('maintenanceResponsibilities.responsibilityGuide.privateGreenSpacesMaintenance')
      ]
    },
    {
      key: 'minorRepairs',
      title: t('maintenanceResponsibilities.responsibilityGuide.minorRepairs'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.lightBulbReplacement'),
        t('maintenanceResponsibilities.responsibilityGuide.drainUnblocking'),
        t('maintenanceResponsibilities.responsibilityGuide.leakyFaucetRepair'),
        t('maintenanceResponsibilities.responsibilityGuide.plumbingJointsReplacement')
      ]
    },
    {
      key: 'equipmentInstallations',
      title: t('maintenanceResponsibilities.responsibilityGuide.equipmentInstallations'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.individualBoilerMaintenance'),
        t('maintenanceResponsibilities.responsibilityGuide.chimneySweeping'),
        t('maintenanceResponsibilities.responsibilityGuide.vmcMaintenance'),
        t('maintenanceResponsibilities.responsibilityGuide.smokeDetectorBattery')
      ]
    },
    {
      key: 'normalWear',
      title: t('maintenanceResponsibilities.responsibilityGuide.normalWear'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.paintAndWallpaper'),
        t('maintenanceResponsibilities.responsibilityGuide.carpetAndFloorCoverings'),
        t('maintenanceResponsibilities.responsibilityGuide.doorAndWindowHandles'),
        t('maintenanceResponsibilities.responsibilityGuide.switchesAndOutlets')
      ]
    }
  ];

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-base sm:text-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">{t('maintenanceResponsibilities.responsibilityGuide.tenantResponsibility')}</span>
        </CardTitle>
        <CardDescription className="text-blue-700 text-xs sm:text-sm">
          {t('maintenanceResponsibilities.responsibilityGuide.tenantResponsibilityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
        {responsibilityCategories.map((category) => (
          <Collapsible key={category.key}>
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full p-2 sm:p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left"
              onClick={() => toggleSection(category.key)}
            >
              <span className="font-medium text-blue-800 text-xs sm:text-sm truncate pr-2">
                {category.title}
              </span>
              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-blue-600 transition-transform flex-shrink-0 ${
                openSections.includes(category.key) ? 'rotate-180' : ''
              }`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 sm:mt-2">
              <div className="bg-white rounded-lg border border-blue-200 p-2 sm:p-3">
                <ul className="space-y-1 sm:space-y-2">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-blue-700">
                      <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};

export default TenantResponsibilities;
