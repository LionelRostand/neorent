
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileStatusMessagesProps {
  updateSuccess: boolean;
  updateError: string | null;
}

const ProfileStatusMessages: React.FC<ProfileStatusMessagesProps> = ({
  updateSuccess,
  updateError
}) => {
  if (!updateSuccess && !updateError) return null;

  return (
    <>
      {updateSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Profil mis à jour avec succès</span>
        </div>
      )}
      
      {updateError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{updateError}</span>
        </div>
      )}
    </>
  );
};

export default ProfileStatusMessages;
