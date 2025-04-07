
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleCheck, Package, ShoppingBag } from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const isSuccess = status === "success";

  useEffect(() => {
    // Clear the cart from local storage after successful payment
    if (isSuccess) {
      localStorage.removeItem("foodtruck_cart");
    }
  }, [isSuccess]);

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CircleCheck className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your payment has been successfully processed. We've sent an order confirmation email with details.
        </p>
        
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/orders">
              <Package className="mr-2 h-5 w-5" />
              View My Orders
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/vendors">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
