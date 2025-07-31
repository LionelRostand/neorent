
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useTranslation } from 'react-i18next';

interface RevenueChartProps {
  payments?: any[];
  properties?: any[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ payments, properties }) => {
  const { t } = useTranslation();
  
  // Utiliser les données passées en props ou les hooks globaux par défaut
  const { payments: globalPayments } = useFirebasePayments();
  const { properties: globalProperties } = useFirebaseProperties();
  
  const finalPayments = payments || globalPayments;
  const finalProperties = properties || globalProperties;

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
      const monthlyPayments = finalPayments.filter(payment => {
        if (!payment.paymentDate || payment.status !== 'Payé') return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === monthIndex && 
               paymentDate.getFullYear() === year;
      });

      // Séparer les revenus selon le type de propriété réel
      let locatifRevenue = 0;
      let colocatifRevenue = 0;

      monthlyPayments.forEach(payment => {
        const property = finalProperties.find(p => 
          p.address === payment.property || 
          p.title === payment.property ||
          p.address.includes(payment.property) ||
          payment.property.includes(p.address)
        );
        
        if (property) {
          if (property.locationType === 'Location') {
            locatifRevenue += payment.rentAmount;
          } else if (property.locationType === 'Colocation') {
            colocatifRevenue += payment.rentAmount;
          }
        } else {
          // Si aucune propriété trouvée, essayer de deviner par le tenantType
          if (payment.tenantType === 'Colocataire' || payment.tenantType === 'colocataire') {
            colocatifRevenue += payment.rentAmount;
          } else {
            locatifRevenue += payment.rentAmount;
          }
        }
      });

      console.log(`📊 Revenus réels pour ${month}:`, {
        locatifs: locatifRevenue,
        colocatifs: colocatifRevenue,
        totalPayments: monthlyPayments.length,
        total: locatifRevenue + colocatifRevenue
      });

      return {
        month,
        locatifs: locatifRevenue,
        colocatifs: colocatifRevenue
      };
    });
  }, [finalPayments, finalProperties]);

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
