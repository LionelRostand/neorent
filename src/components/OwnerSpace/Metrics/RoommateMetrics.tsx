
import { Users, CheckCircle, Home, DollarSign } from 'lucide-react';

interface RoommateMetricsProps {
  ownerRoommates: any[];
  ownerProperties: any[];
}

export const useRoommateMetrics = ({ ownerRoommates, ownerProperties }: RoommateMetricsProps) => {
  const totalRoommates = ownerRoommates.length;
  const activeRoommates = ownerRoommates.filter(r => r.status === 'Active').length;
  
  // Calculate total available rooms based on owner's colocation properties
  const colocationProperties = ownerProperties.filter(p => p.locationType === 'Colocation');
  const totalRooms = colocationProperties.reduce((sum, p) => sum + (Number(p.totalRooms) || 0), 0);
  const availableRooms = totalRooms - activeRoommates;
  
  // Calculate average rent for active roommates
  const activeRoommatesWithRent = ownerRoommates.filter(r => r.status === 'Active' && Number(r.rentAmount) > 0);
  const avgRoommateRent = activeRoommatesWithRent.length > 0 
    ? Math.round(activeRoommatesWithRent.reduce((sum, r) => sum + (Number(r.rentAmount) || 0), 0) / activeRoommatesWithRent.length)
    : 0;

  return [
    {
      title: 'Total Roommates',
      value: totalRoommates,
      description: `${totalRoommates} registered roommates`,
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Roommates',
      value: activeRoommates,
      description: `${activeRoommates} current roommates`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Available Rooms',
      value: availableRooms,
      description: `${availableRooms} rooms available`,
      icon: Home,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Average Rent',
      value: `${avgRoommateRent}€`,
      description: 'Average rent per room',
      icon: DollarSign,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];
};
