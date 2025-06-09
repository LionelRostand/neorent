
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsData } from '@/hooks/useAnalyticsTracking';

interface WeeklyChartProps {
  analyticsData: AnalyticsData;
  hasRealData: boolean;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ analyticsData, hasRealData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          Évolution hebdomadaire
          {!hasRealData && (
            <span className="text-sm font-normal text-gray-500">(Données de démonstration)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.weeklyVisitors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="visitors" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
                name="Visiteurs"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
