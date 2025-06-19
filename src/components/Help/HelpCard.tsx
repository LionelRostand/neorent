
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface HelpSection {
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
  technical: string;
  functional: string;
}

interface HelpCardProps {
  section: HelpSection;
}

const HelpCard: React.FC<HelpCardProps> = ({ section }) => {
  const { t } = useTranslation();
  const Icon = section.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-start gap-2 md:gap-3 text-base md:text-lg">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold truncate">{section.title}</span>
              <Badge variant="secondary" className="text-xs w-fit">
                {section.category}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4 pt-0">
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {section.description}
        </p>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-xs md:text-sm text-blue-700 mb-1">
              {t('help.technicalAspect')}
            </h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
              {section.technical}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-xs md:text-sm text-green-700 mb-1">
              {t('help.functionalUsage')}
            </h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
              {section.functional}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpCard;
