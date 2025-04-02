
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "vendor";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: "google" | "facebook" | "twitter" | "tiktok") => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    // Simulate checking local storage for saved user session
    const savedUser = localStorage.getItem("foodtruck_user");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("foodtruck_user");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulation of an API call
      if (email === "admin@example.com" && password === "password") {
        const userData: User = {
          id: "admin-123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        };
        
        setUser(userData);
        localStorage.setItem("foodtruck_user", JSON.stringify(userData));
        toast.success("Logged in successfully!");
      } else if (email === "vendor@example.com" && password === "password") {
        const userData: User = {
          id: "vendor-123",
          name: "Vendor User",
          email: "vendor@example.com",
          role: "vendor",
        };
        
        setUser(userData);
        localStorage.setItem("foodtruck_user", JSON.stringify(userData));
        toast.success("Logged in successfully!");
      } else if (email === "customer@example.com" && password === "password") {
        const userData: User = {
          id: "customer-123",
          name: "Customer User",
          email: "customer@example.com",
          role: "customer",
        };
        
        setUser(userData);
        localStorage.setItem("foodtruck_user", JSON.stringify(userData));
        toast.success("Logged in successfully!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during login";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: "google" | "facebook" | "twitter" | "tiktok") => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would redirect to the provider's auth page
      // For demo purposes, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `${provider}-user-123`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.com`,
        role: "customer",
        avatar: `/avatars/${provider}-avatar.png`,
      };
      
      setUser(userData);
      localStorage.setItem("foodtruck_user", JSON.stringify(userData));
      toast.success(`Logged in with ${provider} successfully!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : `An error occurred during ${provider} login`;
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to register
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "customer",
      };
      
      setUser(userData);
      localStorage.setItem("foodtruck_user", JSON.stringify(userData));
      toast.success("Registered successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during registration";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("foodtruck_user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithSocial,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
