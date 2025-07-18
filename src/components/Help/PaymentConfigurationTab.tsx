
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Globe, 
  Shield, 
  Settings, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PaymentConfigurationTab = () => {
  const { t } = useTranslation();

  const paymentMethods = [
    {
      icon: CreditCard,
      name: t('help.paymentMethods.creditCard.name'),
      description: t('help.paymentMethods.creditCard.description'),
      steps: t('help.paymentMethods.creditCard.steps', { returnObjects: true }),
      status: 'available',
      complexity: 'easy'
    },
    {
      icon: Building2,
      name: t('help.paymentMethods.bankTransfer.name'),
      description: t('help.paymentMethods.bankTransfer.description'),
      steps: t('help.paymentMethods.bankTransfer.steps', { returnObjects: true }),
      status: 'available',
      complexity: 'medium'
    },
    {
      icon: Smartphone,
      name: t('help.paymentMethods.mobile.name'),
      description: t('help.paymentMethods.mobile.description'),
      steps: t('help.paymentMethods.mobile.steps', { returnObjects: true }),
      status: 'coming-soon',
      complexity: 'easy'
    },
    {
      icon: Globe,
      name: t('help.paymentMethods.paypal.name'),
      description: t('help.paymentMethods.paypal.description'),
      steps: t('help.paymentMethods.paypal.steps', { returnObjects: true }),
      status: 'available',
      complexity: 'easy'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('help.status.available')}
          </Badge>
        );
      case 'coming-soon':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('help.status.comingSoon')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getComplexityBadge = (complexity: string) => {
    const colors = {
      easy: 'bg-blue-100 text-blue-800',
      medium: 'bg-orange-100 text-orange-800',
      hard: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="outline" className={colors[complexity as keyof typeof colors]}>
        {t(`help.complexity.${complexity}`)}
      </Badge>
    );
  };

  // Fonction pour s'assurer que steps est un tableau
  const ensureArray = (steps: any): string[] => {
    if (Array.isArray(steps)) {
      return steps;
    }
    // Si c'est une chaîne, on la divise ou on retourne un tableau par défaut
    if (typeof steps === 'string') {
      return [steps];
    }
    return ['Configuration en cours...'];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('help.paymentConfig')}
        </h2>
        <p className="text-gray-600">
          {t('help.paymentConfigDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map((method, index) => {
          const Icon = method.icon;
          const methodSteps = ensureArray(method.steps);
          
          return (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <Icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="font-semibold">{method.name}</span>
                      <div className="flex gap-2">
                        {getStatusBadge(method.status)}
                        {getComplexityBadge(method.complexity)}
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {method.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('help.configurationSteps')}
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {methodSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {method.status === 'coming-soon' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      {t('help.comingSoonMessage')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            {t('help.securityNote.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 text-sm leading-relaxed">
            {t('help.securityNote.description')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfigurationTab;
