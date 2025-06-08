
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Fév', revenue: 4800 },
  { month: 'Mar', revenue: 4500 },
  { month: 'Avr', revenue: 5200 },
  { month: 'Mai', revenue: 4900 },
  { month: 'Jun', revenue: 5400 },
];

const RevenueChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus Locatifs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
