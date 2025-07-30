
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { AppRoutes } from "@/components/AppRoutes";

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen">
        <Toaster />
        <Sonner />
        <AppRoutes />
      </div>
    </AppProviders>
  );
}

export default App;
