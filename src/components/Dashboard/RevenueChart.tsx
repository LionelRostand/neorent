
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

const RevenueChart = () => {
  const { payments } = useFirebasePayments();

  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    // Créer un tableau pour les 6 derniers mois
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push({
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        monthIndex: date.getMonth()
      });
    }

    // Calculer les revenus pour chaque mois
    return last6Months.map(({ month, year, monthIndex }) => {
      const monthlyRevenue = payments
        .filter(payment => {
          if (!payment.paymentDate || payment.status !== 'Payé') return false;
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === monthIndex && 
                 paymentDate.getFullYear() === year;
        })
        .reduce((sum, payment) => sum + payment.rentAmount, 0);

      return {
        month,
        revenue: monthlyRevenue
      };
    });
  }, [payments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus Locatifs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}€`, 'Revenus']} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
