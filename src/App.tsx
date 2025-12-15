import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LeadProvider } from "@/contexts/LeadContext";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import Dashboard from "./pages/Dashboard";
import PitchBuilder from "./pages/PitchBuilder";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LeadProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pitch-builder" element={<PitchBuilder />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LeadProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
