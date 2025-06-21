
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContractInfoCardProps {
  contractData: any;
  monthlyRent: number;
  monthlyCharges: number;
  totalMonthly: number;
}

const ContractInfoCard: React.FC<ContractInfoCardProps> = ({
  contractData,
  monthlyRent,
  monthlyCharges,
  totalMonthly
}) => {
  const { t } = useTranslation();

  if (!contractData) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg md:text-xl">{t('tenantOverview.contractInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="text-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('tenantOverview.contractDetails')}</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• {t('tenantProfile.name')}: {contractData.tenant}</li>
              <li>• {t('tenantPayments.property')}: {contractData.property}</li>
              <li>• {t('common.amount')}: {contractData.amount}</li>
              <li>• {t('tenantHistory.contractStart')}: {new Date(contractData.startDate).toLocaleDateString('fr-FR')}</li>
              <li>• {t('common.status')}: {contractData.status}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('tenantOverview.generatedHistory')}</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• {t('tenantHistory.since')}: {new Date(contractData.startDate).toLocaleDateString('fr-FR')}</li>
              <li>• {t('tenantHistory.monthlyRent')}: {monthlyRent}€</li>
              <li>• {t('tenantHistory.monthlyCharges')}: {monthlyCharges}€</li>
              <li>• {t('tenantHistory.totalMonthly')}: {totalMonthly}€</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractInfoCard;
