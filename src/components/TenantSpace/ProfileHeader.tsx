
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { User, Edit, Save, X } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  isUpdating: boolean;
  hasChanges: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditing,
  isUpdating,
  hasChanges,
  onEdit,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
        <User className="h-4 w-4 md:h-5 md:w-5" />
        {t('profile.personalInfo')}
      </CardTitle>
      {!isEditing ? (
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          onClick={onEdit}
          className="w-full sm:w-auto"
        >
          <Edit className="h-4 w-4 mr-2" />
          {t('profile.edit')}
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "sm"}
            onClick={onCancel}
            disabled={isUpdating}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            {t('profile.cancel')}
          </Button>
          <Button 
            size={isMobile ? "sm" : "sm"}
            onClick={onSave}
            disabled={isUpdating || !hasChanges}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? t('profile.saving') : t('profile.save')}
          </Button>
        </div>
      )}
    </CardHeader>
  );
};

export default ProfileHeader;
