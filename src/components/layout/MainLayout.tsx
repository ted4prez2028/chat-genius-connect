
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AICallButton from "@/components/videocall/AICallButton";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <div className="fixed bottom-6 left-6 z-40">
        <AICallButton />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
