
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface DocumentStatusBadgeProps {
  documentType: string;
  required: boolean;
  documentExists: boolean;
}

const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({
  documentType,
  required,
  documentExists
}) => {
  const { t } = useTranslation();
  
  console.log(`Badge pour ${documentType}:`, { required, documentExists });
  
  if (documentExists) {
    return <Badge className="bg-green-100 text-green-800">✓ Uploadé</Badge>;
  } else {
    if (required) {
      return <Badge className="bg-red-100 text-red-800">❌ {t('roommates.missing')}</Badge>;
    } else {
      return <Badge variant="secondary">Optionnel</Badge>;
    }
  }
};

export default DocumentStatusBadge;
