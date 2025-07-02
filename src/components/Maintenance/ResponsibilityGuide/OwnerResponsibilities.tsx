
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Home } from 'lucide-react';
import { useState } from 'react';

const OwnerResponsibilities = () => {
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
      key: 'majorWork',
      title: t('maintenanceResponsibilities.responsibilityGuide.majorWork'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.structuralWallRepairs'),
        t('maintenanceResponsibilities.responsibilityGuide.roofWaterproofing'),
        t('maintenanceResponsibilities.responsibilityGuide.thermalInsulation'),
        t('maintenanceResponsibilities.responsibilityGuide.foundationsAndStructure')
      ]
    },
    {
      key: 'mainInstallations',
      title: t('maintenanceResponsibilities.responsibilityGuide.mainInstallations'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.generalPlumbingAndPipes'),
        t('maintenanceResponsibilities.responsibilityGuide.electricalInstallation'),
        t('maintenanceResponsibilities.responsibilityGuide.collectiveHeatingSystem'),
        t('maintenanceResponsibilities.responsibilityGuide.elevator'),
        t('maintenanceResponsibilities.responsibilityGuide.intercomAndDigicode')
      ]
    },
    {
      key: 'securityEquipment',
      title: t('maintenanceResponsibilities.responsibilityGuide.securityEquipment'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.smokeDetectorsSupply'),
        t('maintenanceResponsibilities.responsibilityGuide.guardrailsAndRamps'),
        t('maintenanceResponsibilities.responsibilityGuide.commonAreasLighting'),
        t('maintenanceResponsibilities.responsibilityGuide.fireSecuritySystem')
      ]
    },
    {
      key: 'exteriorJoinery',
      title: t('maintenanceResponsibilities.responsibilityGuide.exteriorJoinery'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.windowsAndShutters'),
        t('maintenanceResponsibilities.responsibilityGuide.apartmentEntranceDoor'),
        t('maintenanceResponsibilities.responsibilityGuide.entranceDoorLockReplacement'),
        t('maintenanceResponsibilities.responsibilityGuide.sealingJoints')
      ]
    }
  ];

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
          <Home className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">{t('maintenanceResponsibilities.responsibilityGuide.ownerResponsibility')}</span>
        </CardTitle>
        <CardDescription className="text-green-700 text-xs sm:text-sm">
          {t('maintenanceResponsibilities.responsibilityGuide.ownerResponsibilityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
        {responsibilityCategories.map((category) => (
          <Collapsible key={category.key}>
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full p-2 sm:p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              onClick={() => toggleSection(category.key)}
            >
              <span className="font-medium text-green-800 text-xs sm:text-sm truncate pr-2">
                {category.title}
              </span>
              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-green-600 transition-transform flex-shrink-0 ${
                openSections.includes(category.key) ? 'rotate-180' : ''
              }`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 sm:mt-2">
              <div className="bg-white rounded-lg border border-green-200 p-2 sm:p-3">
                <ul className="space-y-1 sm:space-y-2">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-green-700">
                      <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">•</span>
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

export default OwnerResponsibilities;
