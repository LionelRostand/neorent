
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatWidget } from "@/components/Chat/ChatWidget";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Roommates from "./pages/Roommates";
import Contracts from "./pages/Contracts";
import Leases from "./pages/Leases";
import Inspections from "./pages/Inspections";
import RentManagement from "./pages/RentManagement";
import RentalCharges from "./pages/RentalCharges";
import Taxes from "./pages/Taxes";
import Website from "./pages/Website";
import Messages from "./pages/Messages";
import TenantSpace from "./pages/TenantSpace";
import PublicHome from "./pages/PublicSite/Home";
import PublicAbout from "./pages/PublicSite/About";
import PublicContact from "./pages/PublicSite/Contact";
import PublicLogin from "./pages/PublicSite/Login";
import NotFound from "./pages/NotFound";
import Settings from './pages/Settings';
import Maintenance from './pages/Maintenance';
import Help from './pages/Help';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Public Site Routes - Now at root */}
              <Route path="/" element={<PublicHome />} />
              <Route path="/about" element={<PublicAbout />} />
              <Route path="/contact" element={<PublicContact />} />
              <Route path="/login" element={<PublicLogin />} />
              
              {/* Tenant Space */}
              <Route path="/tenant-space" element={<TenantSpace />} />
              
              {/* Admin Routes - Now prefixed with /admin */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/properties" element={<Properties />} />
              <Route path="/admin/tenants" element={<Tenants />} />
              <Route path="/admin/roommates" element={<Roommates />} />
              <Route path="/admin/contracts" element={<Contracts />} />
              <Route path="/admin/leases" element={<Leases />} />
              <Route path="/admin/inspections" element={<Inspections />} />
              <Route path="/admin/rent-management" element={<RentManagement />} />
              <Route path="/admin/rental-charges" element={<RentalCharges />} />
              <Route path="/admin/maintenance" element={<Maintenance />} />
              <Route path="/admin/messages" element={<Messages />} />
              <Route path="/admin/taxes" element={<Taxes />} />
              <Route path="/admin/website" element={<Website />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/help" element={<Help />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Chat Widget disponible sur toutes les pages publiques */}
            <ChatWidget />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
