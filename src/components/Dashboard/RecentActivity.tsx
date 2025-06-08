
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Home, DollarSign } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'payment',
    description: 'Loyer reçu - Appartement Rue des Fleurs',
    amount: '1,200€',
    time: 'Il y a 2h',
    icon: DollarSign,
    iconColor: 'bg-green-500'
  },
  {
    id: 2,
    type: 'tenant',
    description: 'Nouveau locataire - Jean Dupont',
    time: 'Il y a 4h',
    icon: User,
    iconColor: 'bg-blue-500'
  },
  {
    id: 3,
    type: 'maintenance',
    description: 'Demande de réparation - Villa Montparnasse',
    time: 'Il y a 1j',
    icon: Home,
    iconColor: 'bg-orange-500'
  },
  {
    id: 4,
    type: 'payment',
    description: 'Loyer en retard - Studio Centre-ville',
    amount: '800€',
    time: 'Il y a 2j',
    icon: Clock,
    iconColor: 'bg-red-500'
  }
];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${activity.iconColor}`}>
                <activity.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              {activity.amount && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {activity.amount}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
