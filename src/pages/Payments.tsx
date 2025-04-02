
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard,
  Download,
  Calendar,
  Clock,
  Search,
  Plus,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Example payment data types
interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  orderId?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethodId: string;
}

interface Invoice {
  id: string;
  date: Date;
  dueDate?: Date;
  orderId: string;
  vendorName: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'partial';
  pdfUrl: string;
}

// Sample data
const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1234567890",
    type: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  },
  {
    id: "pm_0987654321",
    type: "mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2024,
    isDefault: false
  }
];

const initialTransactions: Transaction[] = [
  {
    id: "txn_001",
    date: new Date(2023, 6, 15),
    amount: 375.00,
    description: "50% deposit for Smash Jibarito booking",
    orderId: "ORD-2023-0001",
    status: "completed",
    paymentMethodId: "pm_1234567890"
  },
  {
    id: "txn_002",
    date: new Date(2023, 7, 1),
    amount: 375.00,
    description: "Final payment for Smash Jibarito booking",
    orderId: "ORD-2023-0001",
    status: "completed",
    paymentMethodId: "pm_1234567890"
  },
  {
    id: "txn_003",
    date: new Date(2023, 7, 22),
    amount: 600.00,
    description: "50% deposit for Barstool BBQ booking",
    orderId: "ORD-2023-0002",
    status: "completed",
    paymentMethodId: "pm_0987654321"
  },
  {
    id: "txn_004",
    date: new Date(2023, 5, 10),
    amount: 500.00,
    description: "Payment for Flash Taco booking",
    orderId: "ORD-2023-0003",
    status: "completed",
    paymentMethodId: "pm_1234567890"
  },
  {
    id: "txn_005",
    date: new Date(2023, 7, 30),
    amount: 600.00,
    description: "Final payment for Barstool BBQ booking",
    orderId: "ORD-2023-0002",
    status: "pending",
    paymentMethodId: "pm_0987654321"
  }
];

const initialInvoices: Invoice[] = [
  {
    id: "INV-2023-0001",
    date: new Date(2023, 6, 10),
    orderId: "ORD-2023-0001",
    vendorName: "Smash Jibarito",
    amount: 750.00,
    status: "paid",
    pdfUrl: "#"
  },
  {
    id: "INV-2023-0002",
    date: new Date(2023, 7, 15),
    dueDate: new Date(2023, 7, 30),
    orderId: "ORD-2023-0002",
    vendorName: "Barstool BBQ",
    amount: 1200.00,
    status: "partial",
    pdfUrl: "#"
  },
  {
    id: "INV-2023-0003",
    date: new Date(2023, 5, 5),
    orderId: "ORD-2023-0003",
    vendorName: "Flash Taco",
    amount: 500.00,
    status: "paid",
    pdfUrl: "#"
  },
  {
    id: "INV-2023-0004",
    date: new Date(2023, 8, 1),
    dueDate: new Date(2023, 8, 15),
    orderId: "ORD-2023-0004",
    vendorName: "Barstool BBQ",
    amount: 900.00,
    status: "unpaid",
    pdfUrl: "#"
  }
];

// Card brand logos (simplified)
const getCardLogo = (type: PaymentMethod['type']) => {
  switch(type) {
    case 'visa':
      return "💳 Visa";
    case 'mastercard':
      return "💳 Mastercard";
    case 'amex':
      return "💳 Amex";
    case 'discover':
      return "💳 Discover";
    default:
      return "💳";
  }
};

// Status badges
const getStatusBadge = (status: Transaction['status'] | Invoice['status']) => {
  switch(status) {
    case 'completed':
    case 'paid':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
    case 'pending':
    case 'unpaid':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
    case 'refunded':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Refunded</Badge>;
    case 'partial':
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Partial</Badge>;
    case 'overdue':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const PaymentsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showPayInvoiceDialog, setShowPayInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (transaction.orderId && transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter invoices based on search
  const filteredInvoices = invoices.filter(invoice => 
    invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCard = () => {
    // Simulate adding a new card
    const newCard: PaymentMethod = {
      id: `pm_${Math.random().toString(36).substring(2, 11)}`,
      type: "visa",
      last4: "1234",
      expMonth: 9,
      expYear: 2026,
      isDefault: false
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    setShowAddCardDialog(false);
    
    toast({
      title: "Payment method added",
      description: "Your new card has been successfully added.",
    });
  };

  const handleSetDefaultCard = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    
    toast({
      title: "Payment method removed",
      description: "Your payment method has been successfully removed.",
    });
  };

  const handlePayInvoice = () => {
    if (selectedInvoice) {
      // Update invoice status
      setInvoices(invoices.map(invoice => 
        invoice.id === selectedInvoice.id 
          ? { ...invoice, status: 'paid' as const } 
          : invoice
      ));
      
      // Add a new transaction
      const newTransaction: Transaction = {
        id: `txn_${Math.random().toString(36).substring(2, 11)}`,
        date: new Date(),
        amount: selectedInvoice.status === 'partial' 
          ? selectedInvoice.amount / 2 
          : selectedInvoice.amount,
        description: `Payment for ${selectedInvoice.vendorName} booking`,
        orderId: selectedInvoice.orderId,
        status: 'completed',
        paymentMethodId: paymentMethods.find(m => m.isDefault)?.id || paymentMethods[0].id
      };
      
      setTransactions([newTransaction, ...transactions]);
      setShowPayInvoiceDialog(false);
      
      toast({
        title: "Payment successful",
        description: `Your payment for invoice ${selectedInvoice.id} has been processed.`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Payments & Billing</h1>
      
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search invoices by ID, vendor, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className={invoice.status === 'overdue' ? 'border-red-300' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{invoice.id}</CardTitle>
                        <CardDescription>
                          {invoice.vendorName} - {invoice.orderId}
                        </CardDescription>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Date:</span>
                      <span>{format(invoice.date, "MMM d, yyyy")}</span>
                    </div>
                    {invoice.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Due Date:</span>
                        <span className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                          {format(invoice.dueDate, "MMM d, yyyy")}
                          {invoice.status === 'overdue' && (
                            <span className="ml-2 text-red-600">
                              <AlertCircle className="inline-block h-4 w-4" />
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" className="text-gray-500">
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                    {(invoice.status === 'unpaid' || invoice.status === 'partial' || invoice.status === 'overdue') && (
                      <Button 
                        size="sm"
                        className="bg-brand-pink hover:bg-pink-700"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowPayInvoiceDialog(true);
                        }}
                      >
                        Pay Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No invoices found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search transactions by description or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(transaction.date, "MMM d, yyyy")}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.orderId || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(transaction.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
              <Button 
                onClick={() => setShowAddCardDialog(true)}
                className="bg-brand-pink hover:bg-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </Button>
            </div>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No payment methods found</h3>
                <p className="mt-1 text-gray-500">Add a payment method to make checkout faster.</p>
                <Button 
                  onClick={() => setShowAddCardDialog(true)}
                  className="mt-4 bg-brand-pink hover:bg-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New Card
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getCardLogo(method.type)}</span>
                          <CardTitle className="text-lg">
                            •••• •••• •••• {method.last4}
                            {method.isDefault && (
                              <Badge className="ml-2 bg-gray-100 text-gray-700 border-gray-200">Default</Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-500">Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2">
                      {!method.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefaultCard(method.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteCard(method.id)}
                      >
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment FAQs</h2>
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-4">How are payments processed?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  All payments are securely processed through Stripe, a PCI-compliant payment processor. Your card information is never stored on our servers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="px-4">When am I charged for my booking?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  For most bookings, you'll pay a deposit (typically 50%) at the time of booking, and the remaining balance will be due 1-2 weeks before your event. Some vendors may have different payment schedules, which will be clearly indicated before you complete your booking.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="px-4">What is your refund policy?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Our standard refund policy allows for full refunds if cancelled more than 30 days before the event, 50% refund if cancelled 14-30 days before the event, and no refund if cancelled less than 14 days before the event. However, individual vendors may have different policies, which will be specified in your booking agreement.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="px-4">Are there any additional fees?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  The price you see includes our service fee, which helps us maintain the platform and provide customer support. Some vendors may have additional fees for extended service hours, travel beyond a certain distance, or special menu requests. These will be clearly disclosed before you complete your booking.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Card Dialog */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div>
                <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Exp. Month
                </label>
                <Input id="expMonth" placeholder="MM" />
              </div>
              <div>
                <label htmlFor="expYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Exp. Year
                </label>
                <Input id="expYear" placeholder="YYYY" />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="default"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
              />
              <label htmlFor="default" className="ml-2 block text-sm text-gray-700">
                Set as default payment method
              </label>
            </div>
            <p className="text-sm text-gray-500 flex items-center mt-2">
              <LockClosedIcon className="h-4 w-4 mr-1" /> Your payment information is secure and encrypted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-brand-pink hover:bg-pink-700" onClick={handleAddCard}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pay Invoice Dialog */}
      <Dialog open={showPayInvoiceDialog} onOpenChange={setShowPayInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Invoice</DialogTitle>
            <DialogDescription>
              Complete payment for invoice {selectedInvoice?.id}.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between font-medium">
                  <span>Vendor:</span>
                  <span>{selectedInvoice.vendorName}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Order ID:</span>
                  <span>{selectedInvoice.orderId}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Invoice Date:</span>
                  <span>{format(selectedInvoice.date, "MMM d, yyyy")}</span>
                </div>
                {selectedInvoice.dueDate && (
                  <div className="flex justify-between mt-1">
                    <span>Due Date:</span>
                    <span>{format(selectedInvoice.dueDate, "MMM d, yyyy")}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Amount Due:</span>
                    <span>
                      ${selectedInvoice.status === 'partial' 
                        ? (selectedInvoice.amount / 2).toFixed(2) 
                        : selectedInvoice.amount.toFixed(2)
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`border p-3 rounded-lg flex items-center ${method.isDefault ? 'bg-gray-50 border-gray-300' : 'border-gray-200'}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          id={method.id}
                          defaultChecked={method.isDefault}
                          className="h-4 w-4 text-brand-pink focus:ring-brand-pink"
                        />
                        <label htmlFor={method.id} className="ml-3 block">
                          <span className="text-gray-900 flex items-center">
                            {getCardLogo(method.type)} •••• {method.last4}
                          </span>
                          <span className="text-gray-500 text-sm">
                            Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                            {method.isDefault && <span className="ml-2 text-xs text-gray-500">(Default)</span>}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No payment methods available.</p>
                    <Button 
                      variant="link" 
                      className="text-brand-pink"
                      onClick={() => {
                        setShowPayInvoiceDialog(false);
                        setShowAddCardDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Payment Method
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayInvoiceDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-brand-pink hover:bg-pink-700"
              onClick={handlePayInvoice}
              disabled={paymentMethods.length === 0}
            >
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Lock icon component
const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

export default PaymentsPage;
