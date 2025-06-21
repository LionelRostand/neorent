
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  onUpload: () => void;
  disabled: boolean;
  uploading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUpload,
  disabled,
  uploading
}) => {
  const { t } = useTranslation();
  
  return (
    <Button
      onClick={onUpload}
      disabled={disabled}
      className="w-full h-10 text-sm sm:text-base"
    >
      {uploading ? (
        <>
          <Upload className="h-4 w-4 mr-2 animate-spin" />
          <span className="hidden sm:inline">{t('tenantUpload.uploading')}</span>
          <span className="sm:hidden">{t('tenantUpload.upload')}</span>
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('tenantUpload.uploadTheDocument')}</span>
          <span className="sm:hidden">{t('tenantUpload.upload')}</span>
        </>
      )}
    </Button>
  );
};

export default UploadButton;
