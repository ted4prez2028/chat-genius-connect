
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Download, FileText, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  PaymentMethod, 
  Transaction, 
  Invoice, 
  getPaymentMethods, 
  addPaymentMethod, 
  setDefaultPaymentMethod, 
  deletePaymentMethod,
  getTransactions,
  getInvoices
} from "@/services/accountsService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Form validation schema
const paymentMethodSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be 16 digits")
    .max(19, "Card number too long")
    .regex(/^[0-9\s]+$/, "Card number must contain only digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  expiryMonth: z.string().min(1, "Month required"),
  expiryYear: z.string().min(1, "Year required"),
  cvv: z.string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
  cardType: z.string().min(1, "Card type is required")
});

const Payments = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    paymentMethods: true,
    transactions: true,
    invoices: true
  });
  
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardType: ""
    },
  });

  // Load real data from services
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load payment methods
        setIsLoading(prev => ({ ...prev, paymentMethods: true }));
        const methods = await getPaymentMethods(user?.id);
        setPaymentMethods(methods);
        setIsLoading(prev => ({ ...prev, paymentMethods: false }));
        
        // Load transactions
        setIsLoading(prev => ({ ...prev, transactions: true }));
        const txns = await getTransactions(user?.id);
        setTransactions(txns);
        setIsLoading(prev => ({ ...prev, transactions: false }));
        
        // Load invoices
        setIsLoading(prev => ({ ...prev, invoices: true }));
        const invs = await getInvoices(user?.id);
        setInvoices(invs);
        setIsLoading(prev => ({ ...prev, invoices: false }));
      } catch (error) {
        console.error("Error loading payment data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your payment information.",
          variant: "destructive"
        });
        setIsLoading({
          paymentMethods: false,
          transactions: false,
          invoices: false
        });
      }
    };
    
    loadData();
  }, [user?.id, toast]);

  const handleSetDefaultPaymentMethod = async (id: string) => {
    try {
      const updatedMethods = await setDefaultPaymentMethod(id, user?.id);
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast({
        title: "Error",
        description: "Could not update default payment method.",
        variant: "destructive"
      });
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    const methodToRemove = paymentMethods.find(method => method.id === id);
    if (methodToRemove?.isDefault && paymentMethods.length > 1) {
      toast({
        title: "Cannot remove default payment method",
        description: "Please set another payment method as default first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await deletePaymentMethod(id, user?.id);
      // Refresh payment methods
      const methods = await getPaymentMethods(user?.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Error removing payment method:", error);
      toast({
        title: "Error",
        description: "Could not remove payment method.",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof paymentMethodSchema>) => {
    try {
      // Extract last 4 digits from card number
      const last4 = data.cardNumber.replace(/\s/g, '').slice(-4);
      
      // Create new payment method
      const newPaymentMethod: Omit<PaymentMethod, 'id'> = {
        type: data.cardType as "visa" | "mastercard" | "amex" | "discover",
        last4,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        isDefault: paymentMethods.length === 0 // Make default if it's the first card
      };
      
      await addPaymentMethod(newPaymentMethod, user?.id);
      
      // Refresh payment methods
      const methods = await getPaymentMethods(user?.id);
      setPaymentMethods(methods);
      
      // Reset form and close dialog
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast({
        title: "Error",
        description: "Could not add payment method.",
        variant: "destructive"
      });
    }
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
  
  // Helper to format card numbers with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .match(/.{1,4}/g)
      ?.join(' ')
      .substring(0, 19) || '';
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
                {isLoading.paymentMethods ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : paymentMethods.length === 0 ? (
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
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Check className="h-3 w-3" />
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
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-6 bg-brand-pink hover:bg-pink-700">
                      <Plus className="h-4 w-4 mr-2" /> Add New Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new credit or debit card to your account for faster checkout.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="4242 4242 4242 4242" 
                                  value={field.value}
                                  onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value);
                                    field.onChange(formatted);
                                  }}
                                  maxLength={19} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Month</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => {
                                      const month = (i + 1).toString().padStart(2, '0');
                                      return (
                                        <SelectItem key={month} value={month}>
                                          {month}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="expiryYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="YY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => {
                                      const year = (new Date().getFullYear() + i).toString().slice(2);
                                      return (
                                        <SelectItem key={year} value={year}>
                                          {year}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123" 
                                    {...field} 
                                    maxLength={4} 
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '');
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="cardType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select card type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="visa">Visa</SelectItem>
                                  <SelectItem value="mastercard">Mastercard</SelectItem>
                                  <SelectItem value="amex">American Express</SelectItem>
                                  <SelectItem value="discover">Discover</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-brand-pink hover:bg-pink-700">
                            Add Card
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent payments and refunds</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading.transactions ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions</h3>
                  <p className="text-gray-500">You don't have any transaction history yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <p>{transaction.description}</p>
                          <p className="text-xs text-gray-500">Order #{transaction.orderRef}</p>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${transaction.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="flex justify-center mt-6">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-start text-sm max-w-2xl">
                  <div className="mr-2 mt-0.5">ℹ️</div>
                  <div>
                    <p>Transactions are automatically created when you make a food truck booking or when a refund is processed.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Your billing invoices and payment receipts</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export All
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading.invoices ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No invoices</h3>
                  <p className="text-gray-500">You don't have any invoices yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <p>{invoice.id}</p>
                          <p className="text-xs text-gray-500">Order #{invoice.orderRef}</p>
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{invoice.vendor}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${invoice.amount.toFixed(2)}
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="flex justify-center mt-6">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-start text-sm max-w-2xl">
                  <div className="mr-2 mt-0.5">ℹ️</div>
                  <div>
                    <p>Invoices are automatically generated when a payment is processed. 
                       You can download individual invoices or export all as a ZIP file.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
