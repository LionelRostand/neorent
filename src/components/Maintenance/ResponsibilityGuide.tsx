
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
      category: t('maintenance.majorWork'),
      items: [
        t('maintenance.structuralWallRepairs'),
        t('maintenance.roofWaterproofing'),
        t('maintenance.thermalInsulation'),
        t('maintenance.foundationsAndStructure')
      ]
    },
    {
      category: t('maintenance.mainInstallations'),
      items: [
        t('maintenance.generalPlumbingAndPipes'),
        t('maintenance.electricalInstallation'),
        t('maintenance.collectiveHeatingSystem'),
        t('maintenance.elevator'),
        t('maintenance.intercomAndDigicode')
      ]
    },
    {
      category: t('maintenance.securityEquipment'),
      items: [
        t('maintenance.smokeDetectorsSupply'),
        t('maintenance.guardrailsAndRamps'),
        t('maintenance.commonAreasLighting'),
        t('maintenance.fireSecuritySystem')
      ]
    },
    {
      category: t('maintenance.exteriorJoinery'),
      items: [
        t('maintenance.windowsAndShutters'),
        t('maintenance.apartmentEntranceDoor'),
        t('maintenance.entranceDoorLockReplacement'),
        t('maintenance.sealingJoints')
      ]
    }
  ];

  const locataireResponsibilities = [
    {
      category: t('maintenance.currentMaintenance'),
      items: [
        t('maintenance.regularHouseholdCleaning'),
        t('maintenance.siliconeJointsMaintenance'),
        t('maintenance.windowCleaning'),
        t('maintenance.privateGreenSpacesMaintenance')
      ]
    },
    {
      category: t('maintenance.minorRepairs'),
      items: [
        t('maintenance.lightBulbReplacement'),
        t('maintenance.drainUnblocking'),
        t('maintenance.leakyFaucetRepair'),
        t('maintenance.plumbingJointsReplacement')
      ]
    },
    {
      category: t('maintenance.equipmentInstallations'),
      items: [
        t('maintenance.individualBoilerMaintenance'),
        t('maintenance.chimneySweeping'),
        t('maintenance.vmcMaintenance'),
        t('maintenance.smokeDetectorBattery')
      ]
    },
    {
      category: t('maintenance.normalWear'),
      items: [
        t('maintenance.paintAndWallpaper'),
        t('maintenance.carpetAndFloorCoverings'),
        t('maintenance.doorAndWindowHandles'),
        t('maintenance.switchesAndOutlets')
      ]
    }
  ];

  const specialCases = [
    {
      title: t('maintenance.hiddenDefects'),
      description: t('maintenance.hiddenDefectsDescription'),
      responsibility: t('maintenance.ownerTag'),
      details: t('maintenance.ownerDefectsDetail')
    },
    {
      title: t('maintenance.tenantDegradations'),
      description: t('maintenance.tenantDegradationsDescription'),
      responsibility: t('maintenance.tenantTag'),
      details: t('maintenance.tenantDegradationsDetail')
    },
    {
      title: t('maintenance.urgencies'),
      description: t('maintenance.urgenciesDescription'),
      responsibility: t('maintenance.ownerTag'),
      details: t('maintenance.urgenciesDetail')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              {t('maintenance.ownerResponsibility')}
            </CardTitle>
            <CardDescription>
              {t('maintenance.ownerResponsibilityDescription')}
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
              {t('maintenance.tenantResponsibility')}
            </CardTitle>
            <CardDescription>
              {t('maintenance.tenantResponsibilityDescription')}
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
            {t('maintenance.specialCases')}
          </CardTitle>
          <CardDescription>
            {t('maintenance.specialSituationsDescription')}
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
                    variant={specialCase.responsibility === t('maintenance.ownerTag') ? 'default' : 'secondary'}
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
          <CardTitle className="text-blue-800">{t('maintenance.legalReference')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            {t('maintenance.maintenanceChargesFramework')}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• <strong>{t('maintenance.law1989')}</strong> {t('maintenance.rentalReports')}</li>
            <li>• <strong>{t('maintenance.decree1987')}</strong> {t('maintenance.tenantRepairs')}</li>
            <li>• <strong>{t('maintenance.article1724')}</strong> {t('maintenance.landlordObligations')}</li>
            <li>• <strong>{t('maintenance.article1728')}</strong> {t('maintenance.tenantObligations')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsibilityGuide;
