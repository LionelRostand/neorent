
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Euro, CheckCircle, Home, TrendingUp } from 'lucide-react';

interface PaymentSummaryCardsProps {
  totalPaid: number;
  paidPayments: number;
  monthlyRent: number;
  monthlyCharges: number;
}

const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({
  totalPaid,
  paidPayments,
  monthlyRent,
  monthlyCharges
}) => {
  const { t } = useTranslation();

  const summaryCards = [
    {
      title: t('tenantHistory.totalPaid'),
      value: `${totalPaid}€`,
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('tenantHistory.paymentsCount'),
      value: paidPayments.toString(),
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('tenantHistory.monthlyRent'),
      value: `${monthlyRent}€`,
      icon: Home,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: t('tenantHistory.monthlyCharges'),
      value: `${monthlyCharges}€`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentSummaryCards;
