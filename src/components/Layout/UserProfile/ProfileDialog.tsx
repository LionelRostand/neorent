
import React from 'react';
import { User } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  userProfile: any | null;
  userType: 'locataire' | 'colocataire' | 'admin' | 'employee' | null;
}

export const ProfileDialog = ({ 
  open, 
  onOpenChange, 
  user, 
  userProfile, 
  userType 
}: ProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Mon profil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              value={userProfile?.name || 'Non défini'}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={user.email || 'Non défini'}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input
              value={userType === 'admin' ? 'Administrateur' : 'Employé'}
              readOnly
              className="bg-gray-50"
            />
          </div>
          {userProfile?.permissions && (
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex flex-wrap gap-1">
                  {userProfile.permissions.map((permission: string) => (
                    <span
                      key={permission}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
