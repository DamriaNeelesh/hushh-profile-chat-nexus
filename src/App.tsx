import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SharedProfiles from "./pages/SharedProfiles";
import GrantAccess from "./pages/GrantAccess";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Add UUID dependency
import { v4 as uuidv4 } from "uuid";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    // Show loading state
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Comment out authentication check for frontend UI development
  // if (!state.isAuthenticated) {
  //   // Redirect to login if not authenticated
  //   return <Navigate to="/login" />;
  // }
  
  return <>{children}</>;
};

const AuthenticatedApp = () => (
  <ProtectedRoute>
    <ChatProvider>
      <PermissionsProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/shared" element={<SharedProfiles />} />
            <Route path="/grant" element={<GrantAccess />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </PermissionsProvider>
    </ChatProvider>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
