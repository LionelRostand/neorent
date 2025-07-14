
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home } from 'lucide-react';

const OwnerResponsibilities = () => {
  const { t } = useTranslation();

  const proprietaireResponsibilities = [
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.majorWork'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.structuralWallRepairs'),
        t('maintenanceResponsibilities.responsibilityGuide.roofWaterproofing'),
        t('maintenanceResponsibilities.responsibilityGuide.thermalInsulation'),
        t('maintenanceResponsibilities.responsibilityGuide.foundationsAndStructure')
      ]
    },
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.mainInstallations'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.generalPlumbingAndPipes'),
        t('maintenanceResponsibilities.responsibilityGuide.electricalInstallation'),
        t('maintenanceResponsibilities.responsibilityGuide.collectiveHeatingSystem'),
        t('maintenanceResponsibilities.responsibilityGuide.elevator'),
        t('maintenanceResponsibilities.responsibilityGuide.intercomAndDigicode')
      ]
    },
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.securityEquipment'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.smokeDetectorsSupply'),
        t('maintenanceResponsibilities.responsibilityGuide.guardrailsAndRamps'),
        t('maintenanceResponsibilities.responsibilityGuide.commonAreasLighting'),
        t('maintenanceResponsibilities.responsibilityGuide.fireSecuritySystem')
      ]
    },
    {
      category: t('maintenanceResponsibilities.responsibilityGuide.exteriorJoinery'),
      items: [
        t('maintenanceResponsibilities.responsibilityGuide.windowsAndShutters'),
        t('maintenanceResponsibilities.responsibilityGuide.apartmentEntranceDoor'),
        t('maintenanceResponsibilities.responsibilityGuide.entranceDoorLockReplacement'),
        t('maintenanceResponsibilities.responsibilityGuide.sealingJoints')
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          {t('maintenanceResponsibilities.responsibilityGuide.ownerResponsibility')}
        </CardTitle>
        <CardDescription>
          {t('maintenanceResponsibilities.responsibilityGuide.ownerResponsibilityDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {proprietaireResponsibilities.map((section, index) => (
            <AccordionItem key={index} value={`proprietaire-${index}`}>
              <AccordionTrigger className="text-sm font-medium">
                {section.category}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
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

export default OwnerResponsibilities;
