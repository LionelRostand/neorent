
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home, User, AlertCircle } from 'lucide-react';

const ResponsibilityGuide = () => {
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

  const specialCases = [
    {
      title: t('maintenanceResponsibilities.responsibilityGuide.hiddenDefects'),
      description: t('maintenanceResponsibilities.responsibilityGuide.hiddenDefectsDescription'),
      responsibility: t('maintenanceResponsibilities.responsibilityGuide.ownerTag'),
      details: t('maintenanceResponsibilities.responsibilityGuide.ownerDefectsDetail')
    },
    {
      title: t('maintenanceResponsibilities.responsibilityGuide.tenantDegradations'),
      description: t('maintenanceResponsibilities.responsibilityGuide.tenantDegradationsDescription'),
      responsibility: t('maintenanceResponsibilities.responsibilityGuide.tenantTag'),
      details: t('maintenanceResponsibilities.responsibilityGuide.tenantDegradationsDetail')
    },
    {
      title: t('maintenanceResponsibilities.responsibilityGuide.urgencies'),
      description: t('maintenanceResponsibilities.responsibilityGuide.urgenciesDescription'),
      responsibility: t('maintenanceResponsibilities.responsibilityGuide.ownerTag'),
      details: t('maintenanceResponsibilities.responsibilityGuide.urgenciesDetail')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            {t('maintenanceResponsibilities.responsibilityGuide.specialCases')}
          </CardTitle>
          <CardDescription>
            {t('maintenanceResponsibilities.responsibilityGuide.specialSituationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialCases.map((specialCase, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {specialCase.title}
                  </CardTitle>
                  <Badge 
                    variant={specialCase.responsibility === t('maintenanceResponsibilities.responsibilityGuide.ownerTag') ? 'default' : 'secondary'}
                    className="w-fit"
                  >
                    {specialCase.responsibility}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {specialCase.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {specialCase.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">{t('maintenanceResponsibilities.responsibilityGuide.legalReference')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            {t('maintenanceResponsibilities.responsibilityGuide.maintenanceChargesFramework')}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• <strong>{t('maintenanceResponsibilities.responsibilityGuide.law1989')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.rentalReports')}</li>
            <li>• <strong>{t('maintenanceResponsibilities.responsibilityGuide.decree1987')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.tenantRepairs')}</li>
            <li>• <strong>{t('maintenanceResponsibilities.responsibilityGuide.article1724')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.landlordObligations')}</li>
            <li>• <strong>{t('maintenanceResponsibilities.responsibilityGuide.article1728')}</strong> {t('maintenanceResponsibilities.responsibilityGuide.tenantObligations')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsibilityGuide;
