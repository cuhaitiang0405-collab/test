import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { PageTransition } from "@/components/PageTransition";
import { AppShell } from "@/components/layout/AppShell";
import { CockpitPage } from "@/components/cockpit/CockpitPage";
import { DeviceLifecyclePage } from "@/components/devices/DeviceLifecyclePage";
import { Placeholder } from "@/pages/Placeholder";
import NotFound from "./pages/NotFound";

/**
 * Configure TanStack Query client with optimized defaults
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppShell>
            <AnimatedRoutes>
              <Route path="/" element={<Navigate to="/cockpit" replace />} />
              <Route path="/cockpit" element={<PageTransition transition="fade"><CockpitPage /></PageTransition>} />
              <Route path="/devices" element={<PageTransition transition="fade"><DeviceLifecyclePage /></PageTransition>} />
              <Route path="/devices/procure" element={<PageTransition transition="fade"><Placeholder path="/devices/procure" /></PageTransition>} />
              <Route path="/devices/operation" element={<PageTransition transition="fade"><Placeholder path="/devices/operation" /></PageTransition>} />
              <Route path="/devices/repair" element={<PageTransition transition="fade"><Placeholder path="/devices/repair" /></PageTransition>} />
              <Route path="/devices/maintenance" element={<PageTransition transition="fade"><Placeholder path="/devices/maintenance" /></PageTransition>} />
              <Route path="/ingest" element={<PageTransition transition="fade"><Placeholder path="/ingest" /></PageTransition>} />
              <Route path="/govern" element={<PageTransition transition="fade"><Placeholder path="/govern" /></PageTransition>} />
              <Route path="/exchange" element={<PageTransition transition="fade"><Placeholder path="/exchange" /></PageTransition>} />
              <Route path="/master" element={<PageTransition transition="fade"><Placeholder path="/master" /></PageTransition>} />
              <Route path="/quality" element={<PageTransition transition="fade"><Placeholder path="/quality" /></PageTransition>} />
              <Route path="/platform" element={<PageTransition transition="fade"><Placeholder path="/platform" /></PageTransition>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" data-genie-key="NotFound" data-genie-title="Not Found" element={<PageTransition transition="fade"><NotFound /></PageTransition>} />
            </AnimatedRoutes>
          </AppShell>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App
