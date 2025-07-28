
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useTranslation } from 'react-i18next';

const RevenueChart = () => {
  const { t } = useTranslation();
  const { payments } = useFirebasePayments();
  const { properties } = useFirebaseProperties();

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
      const monthlyPayments = payments.filter(payment => {
        if (!payment.paymentDate || payment.status !== 'Payé') return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === monthIndex && 
               paymentDate.getFullYear() === year;
      });

      // Séparer les revenus locatifs et colocatifs basé sur le type de propriété
      const locatifRevenue = monthlyPayments
        .filter(payment => {
          const property = properties.find(p => p.address === payment.property || p.title === payment.property);
          return property && property.locationType === 'Location';
        })
        .reduce((sum, payment) => sum + payment.rentAmount, 0);

      const colocatifRevenue = monthlyPayments
        .filter(payment => {
          const property = properties.find(p => p.address === payment.property || p.title === payment.property);
          return property && property.locationType === 'Colocation';
        })
        .reduce((sum, payment) => sum + payment.rentAmount, 0);

      console.log(`📊 Revenus pour ${month}:`, {
        locatifs: locatifRevenue,
        colocatifs: colocatifRevenue,
        totalPayments: monthlyPayments.length,
        properties: properties.map(p => ({ title: p.title, address: p.address, type: p.locationType }))
      });

      return {
        month,
        locatifs: locatifRevenue,
        colocatifs: colocatifRevenue
      };
    });
  }, [payments, properties]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus locatifs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}€`, 
                  name === 'locatifs' ? 'Revenus locatifs' : 'Revenus colocatifs'
                ]} 
              />
              <Line 
                type="monotone" 
                dataKey="locatifs" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                name="locatifs"
              />
              <Line 
                type="monotone" 
                dataKey="colocatifs" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="colocatifs"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
