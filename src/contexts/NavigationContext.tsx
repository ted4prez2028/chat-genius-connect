
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface NavigationContextType {
  currentPage: string;
  pageName: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>(location.pathname);
  const [pageName, setPageName] = useState<string>("Home");

  useEffect(() => {
    setCurrentPage(location.pathname);

    // Update page name based on path
    const path = location.pathname;
    if (path === "/") {
      setPageName("Home");
    } else if (path === "/vendors") {
      setPageName("Vendors");
    } else if (path === "/orders") {
      setPageName("Orders");
    } else if (path === "/payments") {
      setPageName("Payments & Billing");
    } else if (path === "/faqs") {
      setPageName("FAQs");
    } else if (path === "/book") {
      setPageName("Book a Truck");
    } else if (path === "/cart") {
      setPageName("Shopping Cart");
    } else if (path.startsWith("/dashboard")) {
      const subPath = path.split("/")[2] || "";
      const formattedSubPath = subPath.charAt(0).toUpperCase() + subPath.slice(1);
      setPageName(`Dashboard ${formattedSubPath ? "- " + formattedSubPath : ""}`);
    } else if (path === "/login") {
      setPageName("Login");
    } else if (path === "/register") {
      setPageName("Register");
    }
  }, [location]);

  return (
    <NavigationContext.Provider value={{ currentPage, pageName }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
