
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CopyrightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CopyrightModal: React.FC<CopyrightModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Copyright Information
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            © 2025 Neo Rent - Property Management Platform. All rights reserved. 
            Any unauthorized reproduction, distribution or use of this content is strictly prohibited.
          </p>
          <p>
            Neo Rent® is a registered trademark of Neotech-consulting. 
            All other mentioned trademarks are the property of their respective owners.
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyrightModal;
