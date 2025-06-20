
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatWidget } from "@/components/Chat/ChatWidget";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

// Public pages
import PublicHome from "@/pages/PublicSite/Home";
import PublicAbout from "@/pages/PublicSite/About";
import PublicContact from "@/pages/PublicSite/Contact";
import PublicLogin from "@/pages/PublicSite/Login";

// User space pages
import TenantSpace from "@/pages/TenantSpace";
import OwnerSpace from "@/pages/OwnerSpace";

// Admin pages
import Dashboard from "@/pages/Dashboard";
import Properties from "@/pages/Properties";
import Tenants from "@/pages/Tenants";
import Roommates from "@/pages/Roommates";
import Contracts from "@/pages/Contracts";
import Leases from "@/pages/Leases";
import Inspections from "@/pages/Inspections";
import RentManagement from "@/pages/RentManagement";
import RentalCharges from "@/pages/RentalCharges";
import Forecasting from "@/pages/Forecasting";
import Taxes from "@/pages/Taxes";
import Website from "@/pages/Website";
import Messages from "@/pages/Messages";
import Settings from '@/pages/Settings';
import Maintenance from '@/pages/Maintenance';
import Help from '@/pages/Help';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/about" element={<PublicAbout />} />
            <Route path="/contact" element={<PublicContact />} />
            <Route path="/login" element={<PublicLogin />} />

            {/* User Space Routes */}
            <Route 
              path="/tenant-space" 
              element={
                <ProtectedRoute requiredUserTypes={['locataire', 'colocataire', 'admin']}>
                  <TenantSpace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner-space" 
              element={
                <ProtectedRoute requiredUserTypes={['employee', 'admin']}>
                  <OwnerSpace />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/properties" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Properties />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/tenants" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Tenants />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/roommates" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Roommates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/contracts" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Contracts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/leases" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Leases />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/inspections" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Inspections />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/rent-management" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <RentManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/rental-charges" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <RentalCharges />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/forecasting" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Forecasting />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/maintenance" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Maintenance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/messages" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/taxes" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Taxes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/website" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Website />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/help" 
              element={
                <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                  <Help />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <ChatWidget />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
