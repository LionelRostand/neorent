
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';
import NewRentPaymentCard from './NewRentPaymentCard';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  contractRentAmount?: number;
  paidAmount?: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface NewRentPaymentsListProps {
  payments: Payment[];
  onMarkAsPaid: (paymentId: string) => void;
  onDeletePayment: (paymentId: string) => void;
}

const NewRentPaymentsList: React.FC<NewRentPaymentsListProps> = ({
  payments,
  onMarkAsPaid,
  onDeletePayment
}) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { 
    month: 'long',
    year: 'numeric' 
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentMonth} Payments
        </h2>
        <p className="text-base text-gray-600 mt-1">
          Overview based on lease contracts
        </p>
      </div>

      <div className="p-6">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No payments</h3>
            <p className="mt-2 text-base text-gray-500">
              Rent payments will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {payments.map((payment) => (
              <NewRentPaymentCard
                key={payment.id}
                payment={payment}
                onMarkAsPaid={onMarkAsPaid}
                onDelete={onDeletePayment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRentPaymentsList;
