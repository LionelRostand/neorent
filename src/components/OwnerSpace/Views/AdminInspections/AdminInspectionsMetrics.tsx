
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Calendar, AlertTriangle, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminInspectionsMetricsProps {
  totalInspections: number;
  completedInspections: number;
  plannedInspections: number;
  inProgressInspections: number;
}

const AdminInspectionsMetrics: React.FC<AdminInspectionsMetricsProps> = ({
  totalInspections,
  completedInspections,
  plannedInspections,
  inProgressInspections
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{t('inspections.totalInspections')}</CardTitle>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileCheck className="h-4 w-4 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalInspections}</div>
          <p className="text-xs text-gray-500 mt-1">{totalInspections} {t('inspections.totalInspections').toLowerCase()}</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{t('inspections.completedInspections')}</CardTitle>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{completedInspections}</div>
          <p className="text-xs text-gray-500 mt-1">{completedInspections} {t('inspections.completedInspections').toLowerCase()}</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{t('inspections.plannedInspections')}</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{plannedInspections}</div>
          <p className="text-xs text-gray-500 mt-1">{plannedInspections} {t('inspections.plannedInspections').toLowerCase()}</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{t('inspections.inProgressInspections')}</CardTitle>
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{inProgressInspections}</div>
          <p className="text-xs text-gray-500 mt-1">{inProgressInspections} {t('inspections.inProgressInspections').toLowerCase()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInspectionsMetrics;
