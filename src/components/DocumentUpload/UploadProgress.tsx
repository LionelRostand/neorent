
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UploadProgressProps {
  uploadProgress: number;
  onCancelUpload: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  uploadProgress, 
  onCancelUpload 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{t('tenantUpload.uploading')}</span>
        <Button
          onClick={onCancelUpload}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          {t('common.cancel')}
        </Button>
      </div>
      <Progress value={uploadProgress} className="w-full" />
      <p className="text-xs text-center text-gray-500">
        {uploadProgress}% {t('tenantUpload.progress')}
      </p>
    </div>
  );
};

export default UploadProgress;
