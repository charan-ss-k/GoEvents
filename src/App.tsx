
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Tickets from "./pages/Tickets";
import CheckIn from "./pages/CheckIn";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import ManagerSignup from "./pages/ManagerSignup";
import WorkerSignup from "./pages/WorkerSignup";
import ClientSignup from "./pages/ClientSignup";
import BookTickets from "./pages/BookTickets";
import Admin from "./pages/Admin";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Common footer component
const Footer: React.FC = () => (
  <footer className="py-6 text-center text-sm text-muted-foreground">
    © 2025 GoEvents All Rights Reserved
  </footer>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup/manager" element={<ManagerSignup />} />
              <Route path="/signup/worker" element={<WorkerSignup />} />
              <Route path="/signup/client" element={<ClientSignup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/book-tickets" element={<BookTickets />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
