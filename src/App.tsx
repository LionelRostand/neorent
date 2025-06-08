
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import TenantSpace from "./pages/TenantSpace";
import PublicHome from "./pages/PublicSite/Home";
import PublicAbout from "./pages/PublicSite/About";
import PublicContact from "./pages/PublicSite/Contact";
import PublicLogin from "./pages/PublicSite/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/leases" element={<Leases />} />
          <Route path="/inspections" element={<Inspections />} />
          <Route path="/rent-management" element={<RentManagement />} />
          <Route path="/rental-charges" element={<RentalCharges />} />
          <Route path="/taxes" element={<Taxes />} />
          <Route path="/website" element={<Website />} />
          <Route path="/settings" element={<Dashboard />} />
          
          {/* Public Site Routes */}
          <Route path="/site" element={<PublicHome />} />
          <Route path="/site/about" element={<PublicAbout />} />
          <Route path="/site/contact" element={<PublicContact />} />
          <Route path="/site/login" element={<PublicLogin />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
