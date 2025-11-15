import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
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
import { useAuthStore } from "./lib/utils";

const queryClient = new QueryClient();

// --- Layout pentru Rutele Protejate (Dashboard) ---
// Verifică dacă utilizatorul este logat. Dacă nu, redirecționează către /auth.
const ProtectedLayout = () => {
  const { user, businessUser, accountType } = useAuthStore();

  if (user === null && businessUser === null) {
    // Nu este logat
    return <Navigate to="/auth" replace />;
  }

  // Este logat, afișează layout-ul dashboard-ului
  // DashboardLayout va conține un <Outlet /> pentru rutele copil
  return <DashboardLayout accountType={accountType} />;
};

// --- Layout for Rutele Publice ---
// Verifică dacă utilizatorul este logat. Dacă da, redirecționează către dashboard.
// Previne accesul la /auth și /landing dacă ești deja logat.
const PublicOnlyLayout = () => {
  const { user, businessUser } = useAuthStore();

  if (user !== null) {
    // Logat ca personal, redirecționează la /
    return <Navigate to="/" replace />;
  }

  if (businessUser !== null) {
    // Logat ca business, redirecționează la /business/home
    return <Navigate to="/business/home" replace />;
  }

  // Nu este logat, afișează pagina publică (Auth sau Landing)
  return <Outlet />;
};

const App = () => {
  // Preluăm accountType aici pentru a-l folosi în logica de rutare
  const { accountType } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* --- Rute Publice (Protejate de PublicOnlyLayout) --- */}
            {/* Doar utilizatorii nelogați pot vedea /landing și /auth */}
            
              <Route path="/landing" element={<Index />} />
            <Route element={<PublicOnlyLayout />}>
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* --- Rute Protejate (Dashboard) --- */}
            {/* Doar utilizatorii logați pot vedea aceste rute */}
            <Route element={<ProtectedLayout />}>
              {/* Rutele se afișează condiționat pe baza accountType */}

              {/* USER ROUTES */}
              {accountType === "personal" && (
                <>
                  <Route
                    path="/business/*"
                    element={<Navigate to="/" replace />}
                  />
                  <Route path="/" element={<Home />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/chat/:type/:id" element={<Chat />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/ai-cv-builder" element={<AICVBuilder />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* Orice altă rută neconcordantă în modul personal redirecționează la / */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}

              {/* BUSINESS ROUTES */}
              {accountType === "business" && (
                <>
                  <Route
                    path="/"
                    element={<Navigate to="/business/home" replace />}
                  />
                  <Route path="/business/home" element={<BusinessHome />} />
                  <Route path="/business/chat" element={<BusinessChat />} />
                  <Route path="/business/post-job" element={<PostJobOffer />} />
                  <Route
                    path="/business/create-task"
                    element={<CreateTask />}
                  />
                  <Route path="/chat/:type/:id" element={<Chat />} />
                  <Route path="/business/tasks" element={<BusinessTasks />} />
                  <Route
                    path="/business/profile"
                    element={<BusinessProfile />}
                  />
                  {/* Orice altă rută neconcordantă în modul business redirecționează la /business/home */}
                  <Route
                    path="*"
                    element={<Navigate to="/business/home" replace />}
                  />
                </>
              )}
            </Route>

            {/* Catch-all (404 Not Found) */}
            {/* Aceasta va fi atinsă doar dacă nicio altă rută nu se potrivește */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
