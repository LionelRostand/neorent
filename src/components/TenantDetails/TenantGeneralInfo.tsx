
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  DollarSign,
  Building,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import PaymentStatusCard from './PaymentStatusCard';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
}

interface TenantGeneralInfoProps {
  tenant: Tenant;
}

const TenantGeneralInfo: React.FC<TenantGeneralInfoProps> = ({ tenant }) => {
  // Calculate payment status
  const currentDate = new Date();
  const nextPaymentDate = new Date(tenant.nextPayment);
  const isLate = nextPaymentDate < currentDate;
  const isUpcoming = nextPaymentDate.getTime() - currentDate.getTime() <= 7 * 24 * 60 * 60 * 1000; // 7 days

  const getPaymentStatus = () => {
    if (isLate) {
      return { status: 'En retard', color: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (isUpcoming) {
      return { status: 'À venir', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    } else {
      return { status: 'À jour', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const paymentStatus = getPaymentStatus();

  return (
    <div className="space-y-6">
      {/* Informations du locataire */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {tenant.image ? (
                <img 
                  src={tenant.image} 
                  alt={tenant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tenant.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {tenant.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {tenant.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="mr-2 h-4 w-4" />
                  Appartement: {tenant.property}
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="mr-2 h-4 w-4" />
                  Type: Location
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Début bail: {new Date(tenant.leaseStart).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statut de paiement */}
      <PaymentStatusCard 
        tenant={tenant}
        paymentStatus={paymentStatus}
      />
    </div>
  );
};

export default TenantGeneralInfo;
