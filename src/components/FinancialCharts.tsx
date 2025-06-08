
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenus: 4200, depenses: 800 },
  { month: 'Fév', revenus: 4800, depenses: 1200 },
  { month: 'Mar', revenus: 4500, depenses: 900 },
  { month: 'Avr', revenus: 5200, depenses: 1100 },
  { month: 'Mai', revenus: 4900, depenses: 850 },
  { month: 'Jun', revenus: 5400, depenses: 950 },
];

const expenseData = [
  { name: 'Maintenance', value: 2400, color: '#ff6b6b' },
  { name: 'Assurance', value: 1200, color: '#4ecdc4' },
  { name: 'Taxes', value: 800, color: '#45b7d1' },
  { name: 'Frais de gestion', value: 600, color: '#96ceb4' },
];

const FinancialCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenus vs Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}€`]} />
                <Bar dataKey="revenus" fill="#10b981" name="Revenus" />
                <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}€`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}€`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
