
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsPermissionAlertProps {
  hasPermissionError: boolean;
}

export const AnalyticsPermissionAlert: React.FC<AnalyticsPermissionAlertProps> = ({ 
  hasPermissionError 
}) => {
  if (!hasPermissionError) return null;

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 mb-2">
              Permissions insuffisantes pour les analytics
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Vos permissions Firebase ne permettent pas d'accéder aux données d'analytics. 
              Les données affichées sont des exemples de démonstration.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-600">
              <Shield className="h-4 w-4" />
              <span>
                Pour résoudre ce problème, vérifiez vos règles Firestore dans les paramètres.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
