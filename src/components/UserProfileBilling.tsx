
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Download } from "lucide-react";

interface BillingHistoryItem {
  id: string;
  date: Date;
  amount: string;
  status: "paid" | "pending" | "failed";
  invoiceUrl: string;
}

const UserProfileBilling = () => {
  const [subscription, setSubscription] = useState({
    plan: "Food Truck Admin Pro",
    price: "$49/month",
    status: "active" as "active" | "inactive" | "past_due",
    nextBillingDate: new Date(),
    cardLast4: "4242",
    cardExpiry: "04/2025"
  });
  
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to load billing data
    const loadBillingData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate billing history with realistic dates
      const history: BillingHistoryItem[] = [];
      const today = new Date();
      
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        date.setDate(1); // First day of month
        
        history.push({
          id: `inv-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 9)}`,
          date,
          amount: "$49.00",
          status: Math.random() > 0.9 ? "pending" : "paid",
          invoiceUrl: "#"
        });
      }
      
      // Calculate next billing date (1st of next month)
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      nextBillingDate.setDate(1);
      
      setSubscription(prev => ({
        ...prev,
        nextBillingDate
      }));
      
      setBillingHistory(history);
      setIsLoading(false);
    };
    
    loadBillingData();
  }, []);

  const handleChangePlan = () => {
    toast.info("The plan change functionality will be implemented soon!");
  };

  const handleCancelSubscription = () => {
    toast.info("The subscription cancellation functionality will be implemented soon!");
  };

  const handleUpdateBillingInfo = () => {
    toast.info("The billing info update functionality will be implemented soon!");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusBadge = (status: "active" | "inactive" | "past_due") => {
    switch(status) {
      case "active": 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive": 
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "past_due": 
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Past Due</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Manage your billing information and subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex justify-end">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="rounded-md p-2 border h-10 w-14 flex items-center justify-center">
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{subscription.plan}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subscription.price} • Next billing date: {formatDate(subscription.nextBillingDate)}
                  </p>
                </div>
                {getStatusBadge(subscription.status)}
              </div>
              <div className="mt-4 space-x-2">
                <Button size="sm" variant="outline" onClick={handleChangePlan}>Change Plan</Button>
                <Button size="sm" variant="outline" className="text-red-500" onClick={handleCancelSubscription}>Cancel Subscription</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Payment Method</h4>
              <div className="flex items-center gap-4">
                <div className="rounded-md p-2 border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-8"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">•••• •••• •••• {subscription.cardLast4}</p>
                  <p className="text-xs text-muted-foreground">Expires {subscription.cardExpiry}</p>
                </div>
                <Button size="sm" variant="ghost">Edit</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Billing Address</h4>
              <div className="text-sm">
                <p>FoodTruck Inc.</p>
                <p>123 Food Truck Lane</p>
                <p>San Francisco, CA 94107</p>
                <p>United States</p>
              </div>
              <Button size="sm" variant="outline">Update Address</Button>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Billing History</h4>
              <div className="space-y-2">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between text-sm">
                    <p>{formatDate(invoice.date)}</p>
                    <p className="flex items-center">
                      {invoice.amount}
                      {invoice.status === "pending" && (
                        <Badge variant="outline" className="ml-2 text-xs">Pending</Badge>
                      )}
                    </p>
                    <Button size="sm" variant="ghost" className="h-8">
                      <Download className="h-3 w-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Download All Invoices</Button>
        <Button onClick={handleUpdateBillingInfo}>
          <CreditCard className="mr-2 h-4 w-4" />
          Update Billing Info
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfileBilling;
