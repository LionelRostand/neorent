
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTenantProfileUpdate } from '@/hooks/useTenantProfileUpdate';
import ProfileStatusMessages from './ProfileStatusMessages';
import ProfileHeader from './ProfileHeader';
import ProfileFormFields from './ProfileFormFields';
import EmergencyContactCard from './EmergencyContactCard';

interface TenantProfileProps {
  tenantData: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    leaseStart: string;
    leaseEnd: string;
    status: string;
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };
}

const TenantProfile: React.FC<TenantProfileProps> = ({ tenantData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfile, isUpdating, updateSuccess, updateError, clearError } = useTenantProfileUpdate();
  
  const [formData, setFormData] = useState({
    phone: tenantData.phone,
    emergencyName: tenantData.emergencyContact.name,
    emergencyPhone: tenantData.emergencyContact.phone,
    emergencyRelation: tenantData.emergencyContact.relation
  });

  const hasChanges = () => {
    return formData.phone !== tenantData.phone ||
           formData.emergencyName !== tenantData.emergencyContact.name ||
           formData.emergencyPhone !== tenantData.emergencyContact.phone ||
           formData.emergencyRelation !== tenantData.emergencyContact.relation;
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      setIsEditing(false);
      return;
    }

    const updates = {
      phone: formData.phone,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation
      }
    };

    const success = await updateProfile(tenantData.id, updates);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      phone: tenantData.phone,
      emergencyName: tenantData.emergencyContact.name,
      emergencyPhone: tenantData.emergencyContact.phone,
      emergencyRelation: tenantData.emergencyContact.relation
    });
    setIsEditing(false);
    clearError();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ProfileStatusMessages 
        updateSuccess={updateSuccess}
        updateError={updateError}
      />

      <Card>
        <ProfileHeader
          isEditing={isEditing}
          isUpdating={isUpdating}
          hasChanges={hasChanges()}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        <CardContent className="space-y-4 md:space-y-6">
          <ProfileFormFields
            tenantData={tenantData}
            formData={{ phone: formData.phone }}
            isEditing={isEditing}
            isUpdating={isUpdating}
            onFormDataChange={handleFormDataChange}
          />
        </CardContent>
      </Card>

      <EmergencyContactCard
        tenantData={tenantData}
        formData={{
          emergencyName: formData.emergencyName,
          emergencyPhone: formData.emergencyPhone,
          emergencyRelation: formData.emergencyRelation
        }}
        isEditing={isEditing}
        isUpdating={isUpdating}
        onFormDataChange={handleFormDataChange}
      />
    </div>
  );
};

export default TenantProfile;
