// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import Home from "./pages/Home";
import Team from "./pages/Team";
import Map from "./pages/Map";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import AICVBuilder from "./pages/user/AICVBuilder";
import BusinessHome from "./pages/business/BusinessHome";
import BusinessChat from "./pages/business/BusinessChat";
import PostJobOffer from "./pages/business/PostJobOffer";
import CreateTask from "./pages/business/CreateTask";
import BusinessTasks from "./pages/business/BusinessTasks";
import BusinessProfile from "./pages/business/BusinessProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Top-level pages without dashboard layout */}
          <Route path="/landing" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Dashboard layout wraps these nested routes */}
          <Route element={<DashboardLayout />}>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/chat/:type/:id" element={<Chat />} />
            <Route path="/map" element={<Map />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/ai-cv-builder" element={<AICVBuilder />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Business Routes */}
            <Route path="/business/home" element={<BusinessHome />} />
            <Route path="/business/chat" element={<BusinessChat />} />
            <Route path="/business/post-job" element={<PostJobOffer />} />
            <Route path="/business/create-task" element={<CreateTask />} />
            <Route path="/business/tasks" element={<BusinessTasks />} />
            <Route path="/business/profile" element={<BusinessProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
