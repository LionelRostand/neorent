
import React from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { queryClient } from "@/config/queryClient";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
