
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User } from 'lucide-react';

const TenantResponsibilities = () => {
  const { t } = useTranslation();

  const locataireResponsibilities = [
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.currentMaintenance'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.regularHouseholdCleaning'),
        t('maintenanceResponsibilities.responsibilityGuide.siliconeJointsMaintenance'),
        t('maintenanceResponsibilities.responsibilityGuide.windowCleaning'),
        t('maintenanceResponsibilities.responsibilityGuide.privateGreenSpacesMaintenance')
      ]
    },
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.minorRepairs'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.lightBulbReplacement'),
        t('maintenanceResponsibilities.responsibilityGuide.drainUnblocking'),
        t('maintenanceResponsibilities.responsibilityGuide.leakyFaucetRepair'),
        t('maintenanceResponsibilities.responsibilityGuide.plumbingJointsReplacement')
      ]
    },
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.equipmentInstallations'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.individualBoilerMaintenance'),
        t('maintenanceResponsibilities.responsibilityGuide.chimneySweeping'),
        t('maintenanceResponsibilities.responsibilityGuide.vmcMaintenance'),
        t('maintenanceResponsibilities.responsibilityGuide.smokeDetectorBattery')
      ]
    },
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.normalWear'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.paintAndWallpaper'),
        t('maintenanceResponsibilities.responsibilityGuide.carpetAndFloorCoverings'),
        t('maintenanceResponsibilities.responsibilityGuide.doorAndWindowHandles'),
        t('maintenanceResponsibilities.responsibilityGuide.switchesAndOutlets')
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" />
          {t('maintenanceResponsibilities.responsibilityGuide.tenantResponsibility')}
        </CardTitle>
        <CardDescription>
          {t('maintenanceResponsibilities.responsibilityGuide.tenantResponsibilityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {locataireResponsibilities.map((section, index) => (
            <AccordionItem key={index} value={`locataire-${index}`}>
              <AccordionTrigger className="text-sm font-medium">
                {section.category}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TenantResponsibilities;
