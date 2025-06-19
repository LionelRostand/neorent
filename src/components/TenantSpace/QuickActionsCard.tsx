
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Home, Mail, User } from 'lucide-react';

const QuickActionsCard: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Paiements</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Home className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-green-800">Maintenance</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Mail className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Messages</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <User className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Profil</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
