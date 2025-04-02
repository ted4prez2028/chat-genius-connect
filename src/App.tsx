
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import Index from "./pages/Index";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ChatSupport from "./pages/dashboard/ChatSupport";
import CalendarView from "./pages/dashboard/CalendarView";
import ManageBrands from "./pages/dashboard/ManageBrands";
import Configurations from "./pages/dashboard/Configurations";
import EventLogs from "./pages/dashboard/EventLogs";
import UserProfile from "./pages/dashboard/UserProfile";
import ManageAccounts from "./pages/dashboard/ManageAccounts";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Faqs from "./pages/Faqs";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ChatProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={
                  <MainLayout>
                    <Index />
                  </MainLayout>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <MainLayout>
                    <Orders />
                  </MainLayout>
                } 
              />
              <Route 
                path="/payments" 
                element={
                  <MainLayout>
                    <Payments />
                  </MainLayout>
                } 
              />
              <Route 
                path="/faqs" 
                element={
                  <MainLayout>
                    <Faqs />
                  </MainLayout>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/chat" 
                element={
                  <DashboardLayout>
                    <ChatSupport />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/calendar" 
                element={
                  <DashboardLayout>
                    <CalendarView />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/brands" 
                element={
                  <DashboardLayout>
                    <ManageBrands />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/accounts" 
                element={
                  <DashboardLayout>
                    <ManageAccounts />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <DashboardLayout>
                    <Configurations />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/logs" 
                element={
                  <DashboardLayout>
                    <EventLogs />
                  </DashboardLayout>
                } 
              />
              <Route 
                path="/dashboard/profile" 
                element={
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ChatProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
