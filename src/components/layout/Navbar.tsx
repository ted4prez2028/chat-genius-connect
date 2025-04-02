
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-black text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-brand-yellow transition-colors font-medium uppercase">
            HOME
          </Link>
          <Link to="/vendors" className="hover:text-brand-yellow transition-colors font-medium uppercase">
            VENDORS
          </Link>
          <Link to="/orders" className="hover:text-brand-yellow transition-colors font-medium uppercase">
            ORDERS
          </Link>
          <Link to="/payments" className="hover:text-brand-yellow transition-colors font-medium uppercase">
            PAYMENTS
          </Link>
          <Link to="/faqs" className="hover:text-brand-yellow transition-colors font-medium uppercase">
            FAQs
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-brand-yellow transition-colors font-medium uppercase">
                VIEW ADMIN CONSOLE
              </Link>
              <Button 
                variant="ghost" 
                className="rounded-full bg-brand-yellow text-black hover:bg-brand-yellow/80 h-10 w-10 p-0 flex items-center justify-center"
              >
                <span className="font-bold">{user?.name?.charAt(0) || 'S'}</span>
              </Button>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  2
                </span>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button className="btn-secondary">
                LOGIN
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
