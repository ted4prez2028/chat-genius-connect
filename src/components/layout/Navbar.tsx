
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import ChatWidget from "@/components/chat/ChatWidget";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-[#1a1a1a] text-white p-4 shadow-md sticky top-0 z-50 rounded-xl mb-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="hidden md:flex items-center justify-center space-x-6">
          <Link to="/" className="font-bold text-white hover:text-brand-yellow transition-colors uppercase tracking-wider">
            HOME
          </Link>
          <Link to="/vendors" className="font-bold text-white hover:text-brand-yellow transition-colors uppercase tracking-wider">
            VENDORS
          </Link>
          <Link to="/orders" className="font-bold text-white hover:text-brand-yellow transition-colors uppercase tracking-wider">
            ORDERS
          </Link>
          <Link to="/payments" className="font-bold text-white hover:text-brand-yellow transition-colors uppercase tracking-wider">
            PAYMENTS
          </Link>
          <Link to="/faqs" className="font-bold text-white hover:text-brand-yellow transition-colors uppercase tracking-wider">
            FAQS
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden md:block text-white hover:text-brand-yellow transition-colors font-medium uppercase">
                ADMIN CONSOLE
              </Link>
              <Button 
                variant="ghost" 
                className="rounded-full bg-brand-yellow text-black hover:bg-brand-yellow/80 h-10 w-10 p-0 flex items-center justify-center"
              >
                <span className="font-bold">{user?.name?.charAt(0) || 'S'}</span>
              </Button>
              <Link to="/cart" className="relative text-white hover:text-white">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  2
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/vendors" className="hidden md:block font-bold text-white hover:text-brand-yellow transition-colors mr-4">
                Become a Vendor
              </Link>
              <Link to="/login">
                <Button className="bg-brand-yellow hover:bg-brand-yellow/80 text-black font-bold px-6 py-2 rounded-md">
                  LOGIN
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
