
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import AICallButton from "@/components/videocall/AICallButton";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-64">
        {children}
        <div className="fixed bottom-6 left-6 z-40">
          <AICallButton />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
