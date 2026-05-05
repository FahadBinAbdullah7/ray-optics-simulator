import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Refraction from "./pages/Refraction.tsx";
import SimulatorPage from "./pages/SimulatorPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimulatorPage />} />
          <Route path="/lens-mirror" element={<SimulatorPage />} />
          <Route path="/lens-mirror/convex-lens" element={<SimulatorPage />} />
          <Route path="/lens-mirror/concave-lens" element={<SimulatorPage />} />
          <Route path="/lens-mirror/convex-mirror" element={<SimulatorPage />} />
          <Route path="/lens-mirror/concave-mirror" element={<SimulatorPage />} />
          <Route path="/refraction" element={<SimulatorPage />} />
          <Route path="/refraction/slab" element={<SimulatorPage />} />
          <Route path="/refraction/prism" element={<SimulatorPage />} />
          <Route path="/refraction/stick" element={<SimulatorPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
