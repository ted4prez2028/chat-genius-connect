
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Download, FileText, Plus } from "lucide-react";
import { format } from "date-fns";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "completed" | "pending" | "refunded";
  orderRef: string;
}

interface Invoice {
  id: string;
  orderRef: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  vendor: string;
}

const Payments = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Load or create payment data
    const savedPaymentMethods = localStorage.getItem("foodtruck_payment_methods");
    const savedTransactions = localStorage.getItem("foodtruck_transactions");
    const savedInvoices = localStorage.getItem("foodtruck_invoices");
    
    // Process payment methods
    if (savedPaymentMethods) {
      setPaymentMethods(JSON.parse(savedPaymentMethods));
    } else {
      // Create sample data
      const samplePaymentMethods: PaymentMethod[] = [
        {
          id: "pm_1",
          type: "visa",
          last4: "4242",
          expiryMonth: "12",
          expiryYear: "2025",
          isDefault: true
        },
        {
          id: "pm_2",
          type: "mastercard",
          last4: "8888",
          expiryMonth: "09",
          expiryYear: "2024",
          isDefault: false
        }
      ];
      setPaymentMethods(samplePaymentMethods);
      localStorage.setItem("foodtruck_payment_methods", JSON.stringify(samplePaymentMethods));
    }
    
    // Process transactions
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Create sample transactions
      const sampleTransactions: Transaction[] = [
        {
          id: "txn_1",
          date: format(new Date(2025, 5, 1), "MMM d, yyyy"),
          amount: 900,
          description: "Urban Taco - Event Booking",
          status: "completed",
          orderRef: "FT123456"
        },
        {
          id: "txn_2",
          date: format(new Date(2025, 6, 1), "MMM d, yyyy"),
          amount: 750,
          description: "Sushi Roll - Event Booking",
          status: "pending",
          orderRef: "FT789012"
        },
        {
          id: "txn_3",
          date: format(new Date(2025, 4, 1), "MMM d, yyyy"),
          amount: 1500,
          description: "Smokin' BBQ - Event Booking",
          status: "completed",
          orderRef: "FT345678"
        }
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem("foodtruck_transactions", JSON.stringify(sampleTransactions));
    }
    
    // Process invoices
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      // Create sample invoices
      const sampleInvoices: Invoice[] = [
        {
          id: "inv_1",
          orderRef: "FT123456",
          date: format(new Date(2025, 5, 1), "MMM d, yyyy"),
          dueDate: format(new Date(2025, 5, 15), "MMM d, yyyy"),
          amount: 900,
          status: "paid",
          vendor: "Urban Taco"
        },
        {
          id: "inv_2",
          orderRef: "FT789012",
          date: format(new Date(2025, 6, 1), "MMM d, yyyy"),
          dueDate: format(new Date(2025, 6, 15), "MMM d, yyyy"),
          amount: 750,
          status: "pending",
          vendor: "Sushi Roll"
        },
        {
          id: "inv_3",
          orderRef: "FT345678",
          date: format(new Date(2025, 4, 1), "MMM d, yyyy"),
          dueDate: format(new Date(2025, 4, 15), "MMM d, yyyy"),
          amount: 1500,
          status: "paid",
          vendor: "Smokin' BBQ"
        }
      ];
      setInvoices(sampleInvoices);
      localStorage.setItem("foodtruck_invoices", JSON.stringify(sampleInvoices));
    }
  }, []);

  const handleSetDefaultPaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updatedMethods);
    localStorage.setItem("foodtruck_payment_methods", JSON.stringify(updatedMethods));
  };

  const handleRemovePaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    localStorage.setItem("foodtruck_payment_methods", JSON.stringify(updatedMethods));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return (
          <div className="w-12 h-8 flex items-center justify-center bg-blue-900 text-white rounded">
            <span className="font-bold text-xs tracking-tighter">VISA</span>
          </div>
        );
      case "mastercard":
        return (
          <div className="w-12 h-8 flex items-center justify-center bg-gray-800 text-white rounded">
            <span className="font-bold text-xs tracking-tighter">MC</span>
          </div>
        );
      case "amex":
        return (
          <div className="w-12 h-8 flex items-center justify-center bg-blue-600 text-white rounded">
            <span className="font-bold text-xs tracking-tighter">AMEX</span>
          </div>
        );
      case "discover":
        return (
          <div className="w-12 h-8 flex items-center justify-center bg-orange-600 text-white rounded">
            <span className="font-bold text-xs tracking-tighter">DISC</span>
          </div>
        );
      default:
        return (
          <CreditCard className="h-6 w-6" />
        );
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">Payments & Billing</h1>
      <p className="text-gray-500 text-center mb-12">
        {isAuthenticated 
          ? "Manage your payment methods and view your transaction history"
          : "Sign in to manage your payment methods or view sample data below"}
      </p>
      
      {!isAuthenticated && (
        <div className="max-w-lg mx-auto mb-12 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign In to Manage Payments</h2>
          <p className="text-gray-600 mb-4">Create an account or sign in to access your payment methods and transaction history.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
            <Button className="bg-brand-pink hover:bg-pink-700" onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="payment-methods" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-methods" className="mt-0">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods for faster checkout</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                    <p className="text-gray-500 mb-6">You haven't added any payment methods yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getCardIcon(method.type)}
                          <div>
                            <p className="font-medium">
                              {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ••••{method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </div>
                          {method.isDefault && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSetDefaultPaymentMethod(method.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemovePaymentMethod(method.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button className="mt-6 bg-brand-pink hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" /> Add New Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent payments and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions</h3>
                  <p className="text-gray-500">You don't have any transaction history yet.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-slate-50 p-4 font-medium text-sm">
                    <div>Date</div>
                    <div className="col-span-2">Description</div>
                    <div>Status</div>
                    <div className="text-right">Amount</div>
                  </div>
                  
                  <div className="divide-y">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-5 p-4 text-sm items-center">
                        <div>{transaction.date}</div>
                        <div className="col-span-2">
                          <p>{transaction.description}</p>
                          <p className="text-xs text-gray-500">Order #{transaction.orderRef}</p>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-right font-medium">${transaction.amount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Your billing invoices and payment receipts</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No invoices</h3>
                  <p className="text-gray-500">You don't have any invoices yet.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 bg-slate-50 p-4 font-medium text-sm">
                    <div>Invoice #</div>
                    <div>Date</div>
                    <div>Due Date</div>
                    <div>Vendor</div>
                    <div>Status</div>
                    <div className="text-right">Amount</div>
                  </div>
                  
                  <div className="divide-y">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-6 p-4 text-sm items-center">
                        <div>
                          <p>{invoice.id}</p>
                          <p className="text-xs text-gray-500">Order #{invoice.orderRef}</p>
                        </div>
                        <div>{invoice.date}</div>
                        <div>{invoice.dueDate}</div>
                        <div>{invoice.vendor}</div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-right font-medium">
                          ${invoice.amount.toFixed(2)}
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
