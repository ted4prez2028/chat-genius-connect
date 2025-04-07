
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  X,
  Plus,
  Minus
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorName: string;
  date: Date;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Custom Burrito Bowl",
      price: 12.99,
      quantity: 2,
      image: "/lovable-uploads/1ca80f99-d4fa-47bf-be5e-0d0fa265612d.png",
      vendorName: "Taco Fiesta",
      date: new Date()
    },
    {
      id: "2",
      name: "Loaded Nachos",
      price: 8.99,
      quantity: 1,
      image: "/lovable-uploads/139603f5-0a62-4b62-8395-35b3581c64df.png",
      vendorName: "Taco Fiesta",
      date: new Date()
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const serviceFee = subtotal > 0 ? 2.99 : 0;
  const total = subtotal - discount + tax + serviceFee;
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
    setDiscountApplied(false);
    setPromoCode("");
    toast.success("Cart cleared");
  };
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "food10") {
      setDiscountApplied(true);
      toast.success("Promo code applied: 10% discount");
    } else {
      setDiscountApplied(false);
      toast.error("Invalid promo code");
    }
  };
  
  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Order placed successfully!");
      setCartItems([]);
      setDiscountApplied(false);
      setPromoCode("");
    }, 1500);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <ShoppingCart className="h-10 w-10" />
        Your Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild size="lg">
            <Link to="/vendors">Browse Food Trucks</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </h2>
                <Button variant="outline" size="sm" onClick={clearCart} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Item</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell>
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.vendorName}</p>
                        <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center border rounded-md w-28">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-l-md"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex-1 text-center py-1">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-r-md"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8" 
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Link to="/vendors" className="text-brand-yellow hover:text-brand-yellow/80 flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                
                <div className="border-t pt-3 mt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="promo" className="block text-sm font-medium mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Try "FOOD10" for 10% off</p>
              </div>
              
              <Button 
                className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Checkout Now
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                By checking out, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
