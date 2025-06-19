
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
