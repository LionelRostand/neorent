
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
      category: t('maintenance.responsibilityGuide.majorWork'),
      items: [
        t('maintenance.responsibilityGuide.structuralWallRepairs'),
        t('maintenance.responsibilityGuide.roofWaterproofing'),
        t('maintenance.responsibilityGuide.thermalInsulation'),
        t('maintenance.responsibilityGuide.foundationsAndStructure')
      ]
    },
    {
      category: t('maintenance.responsibilityGuide.mainInstallations'),
      items: [
        t('maintenance.responsibilityGuide.generalPlumbingAndPipes'),
        t('maintenance.responsibilityGuide.electricalInstallation'),
        t('maintenance.responsibilityGuide.collectiveHeatingSystem'),
        t('maintenance.responsibilityGuide.elevator'),
        t('maintenance.responsibilityGuide.intercomAndDigicode')
      ]
    },
    {
      category: t('maintenance.responsibilityGuide.securityEquipment'),
      items: [
        t('maintenance.responsibilityGuide.smokeDetectorsSupply'),
        t('maintenance.responsibilityGuide.guardrailsAndRamps'),
        t('maintenance.responsibilityGuide.commonAreasLighting'),
        t('maintenance.responsibilityGuide.fireSecuritySystem')
      ]
    },
    {
      category: t('maintenance.responsibilityGuide.exteriorJoinery'),
      items: [
        t('maintenance.responsibilityGuide.windowsAndShutters'),
        t('maintenance.responsibilityGuide.apartmentEntranceDoor'),
        t('maintenance.responsibilityGuide.entranceDoorLockReplacement'),
        t('maintenance.responsibilityGuide.sealingJoints')
      ]
    }
  ];

  const locataireResponsibilities = [
    {
      category: t('maintenance.responsibilityGuide.currentMaintenance'),
      items: [
        t('maintenance.responsibilityGuide.regularHouseholdCleaning'),
        t('maintenance.responsibilityGuide.siliconeJointsMaintenance'),
        t('maintenance.responsibilityGuide.windowCleaning'),
        t('maintenance.responsibilityGuide.privateGreenSpacesMaintenance')
      ]
    },
    {
      category: t('maintenance.responsibilityGuide.minorRepairs'),
      items: [
        t('maintenance.responsibilityGuide.lightBulbReplacement'),
        t('maintenance.responsibilityGuide.drainUnblocking'),
        t('maintenance.responsibilityGuide.leakyFaucetRepair'),
        t('maintenance.responsibilityGuide.plumbingJointsReplacement')
      ]
    },
    {
      category: t('maintenance.responsibilityGuide.equipmentInstallations'),
      items: [
        t('maintenance.responsibilityGuide.individualBoilerMaintenance'),
        t('maintenance.responsibilityGuide.chimneySweeping'),
        t('maintenance.responsibilityGuide.vmcMaintenance'),
        t('maintenance.responsibilityGuide.smokeDetectorBattery')
      ]
    },
    {
      category: t('maintenance.responsibilityGuide.normalWear'),
      items: [
        t('maintenance.responsibilityGuide.paintAndWallpaper'),
        t('maintenance.responsibilityGuide.carpetAndFloorCoverings'),
        t('maintenance.responsibilityGuide.doorAndWindowHandles'),
        t('maintenance.responsibilityGuide.switchesAndOutlets')
      ]
    }
  ];

  const specialCases = [
    {
      title: t('maintenance.responsibilityGuide.hiddenDefects'),
      description: t('maintenance.responsibilityGuide.hiddenDefectsDescription'),
      responsibility: t('maintenance.responsibilityGuide.ownerTag'),
      details: t('maintenance.responsibilityGuide.ownerDefectsDetail')
    },
    {
      title: t('maintenance.responsibilityGuide.tenantDegradations'),
      description: t('maintenance.responsibilityGuide.tenantDegradationsDescription'),
      responsibility: t('maintenance.responsibilityGuide.tenantTag'),
      details: t('maintenance.responsibilityGuide.tenantDegradationsDetail')
    },
    {
      title: t('maintenance.responsibilityGuide.urgencies'),
      description: t('maintenance.responsibilityGuide.urgenciesDescription'),
      responsibility: t('maintenance.responsibilityGuide.ownerTag'),
      details: t('maintenance.responsibilityGuide.urgenciesDetail')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              {t('maintenance.responsibilityGuide.ownerResponsibility')}
            </CardTitle>
            <CardDescription>
              {t('maintenance.responsibilityGuide.ownerResponsibilityDescription')}
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
              {t('maintenance.responsibilityGuide.tenantResponsibility')}
            </CardTitle>
            <CardDescription>
              {t('maintenance.responsibilityGuide.tenantResponsibilityDescription')}
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
            {t('maintenance.responsibilityGuide.specialCases')}
          </CardTitle>
          <CardDescription>
            {t('maintenance.responsibilityGuide.specialSituationsDescription')}
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
                    variant={specialCase.responsibility === t('maintenance.responsibilityGuide.ownerTag') ? 'default' : 'secondary'}
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
          <CardTitle className="text-blue-800">{t('maintenance.responsibilityGuide.legalReference')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            {t('maintenance.responsibilityGuide.maintenanceChargesFramework')}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• <strong>{t('maintenance.responsibilityGuide.law1989')}</strong> {t('maintenance.responsibilityGuide.rentalReports')}</li>
            <li>• <strong>{t('maintenance.responsibilityGuide.decree1987')}</strong> {t('maintenance.responsibilityGuide.tenantRepairs')}</li>
            <li>• <strong>{t('maintenance.responsibilityGuide.article1724')}</strong> {t('maintenance.responsibilityGuide.landlordObligations')}</li>
            <li>• <strong>{t('maintenance.responsibilityGuide.article1728')}</strong> {t('maintenance.responsibilityGuide.tenantObligations')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsibilityGuide;
