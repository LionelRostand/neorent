
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Users, Home, Calculator } from 'lucide-react';

interface QuickActionsSummaryTableProps {
  ownerProperties: any[];
  activeTenants: any[];
  expiringContracts: any[];
  pendingPayments: any[];
}

const QuickActionsSummaryTable: React.FC<QuickActionsSummaryTableProps> = ({
  ownerProperties,
  activeTenants,
  expiringContracts,
  pendingPayments
}) => {
  const { t } = useTranslation();

  const summaryData = [
    {
      icon: Plus,
      action: 'New Property',
      description: 'Add a property',
      count: ownerProperties.length,
      label: 'properties',
      color: 'bg-blue-500'
    },
    {
      icon: FileText,
      action: 'New Contract',
      description: 'Create a lease',
      count: expiringContracts.length,
      label: 'contracts expiring soon',
      color: 'bg-yellow-500'
    },
    {
      icon: Users,
      action: 'Add Tenant',
      description: 'Register a tenant',
      count: activeTenants.length,
      label: 'active tenants',
      color: 'bg-purple-500'
    },
    {
      icon: Home,
      action: 'Property Inspection',
      description: 'Schedule a visit',
      count: 2, // Simulated data as shown in the image
      label: 'scheduled inspections',
      color: 'bg-orange-500'
    },
    {
      icon: Calculator,
      action: 'Calculate Charges',
      description: 'Annual review',
      count: pendingPayments.length,
      label: 'pending payments',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-white">
          Actions Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-green-400/30">
              <TableHead className="text-white/90 text-xs font-medium px-3 py-2">Action</TableHead>
              <TableHead className="text-white/90 text-xs font-medium px-3 py-2 text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.map((item, index) => {
              const Icon = item.icon;
              return (
                <TableRow key={index} className="border-green-400/20 hover:bg-green-400/20">
                  <TableCell className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${item.color} flex-shrink-0`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-xs font-medium truncate">
                          {item.action}
                        </div>
                        <div className="text-white/70 text-xs truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <div className="text-white text-xs font-bold">
                      {item.count}
                    </div>
                    <div className="text-white/70 text-xs">
                      {item.label}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QuickActionsSummaryTable;
