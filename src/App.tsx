import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import RegistrosBasicos from "./pages/RegistrosBasicos.tsx";
import RegistrosReproductivos from "./pages/RegistrosReproductivos.tsx";
import RegistrosProductivos from "./pages/RegistrosProductivos.tsx";
import RegistrosOtros from "./pages/RegistrosOtros.tsx";
import ReporteVacas from "./pages/ReporteVacas.tsx";
import ReporteToros from "./pages/ReporteToros.tsx";
import TableroFinal from "./pages/TableroFinal.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reproductivos" element={<RegistrosReproductivos />} />
          <Route path="/productivos" element={<RegistrosProductivos />} />
          <Route path="/otros" element={<RegistrosOtros />} />
          <Route path="/reporte-vacas" element={<ReporteVacas />} />
          <Route path="/reporte-toros" element={<ReporteToros />} />
          <Route path="/tablero-final" element={<TableroFinal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
