
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
  MoreHorizontal,
  Truck
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Example order data
interface Order {
  id: string;
  date: Date;
  vendor: string;
  vendorImage: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total: number;
  guests: number;
  details: string;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
}

const initialOrders: Order[] = [
  {
    id: "ORD-2023-0001",
    date: new Date(2023, 6, 15, 12, 0),
    vendor: "Smash Jibarito",
    vendorImage: "/public/lovable-uploads/139603f5-0a62-4b62-8395-35b3581c64df.png",
    location: "Lincoln Park, Chicago, IL",
    status: "confirmed",
    total: 750,
    guests: 50,
    details: "Corporate lunch event with Puerto Rican cuisine",
    paymentStatus: "paid"
  },
  {
    id: "ORD-2023-0002",
    date: new Date(2023, 7, 22, 18, 30),
    vendor: "Barstool BBQ",
    vendorImage: "/public/lovable-uploads/11f9528a-dda2-46b9-b183-933ed8329d8f.png",
    location: "Millennium Park, Chicago, IL",
    status: "pending",
    total: 1200,
    guests: 80,
    details: "Family reunion with Southern BBQ offerings",
    paymentStatus: "partial"
  },
  {
    id: "ORD-2023-0003",
    date: new Date(2023, 5, 10, 11, 0),
    vendor: "Flash Taco",
    vendorImage: "/public/lovable-uploads/c0bc3b3b-a4cc-4801-8764-92e0d2e58413.png",
    location: "Grant Park, Chicago, IL",
    status: "completed",
    total: 500,
    guests: 35,
    details: "Birthday party with authentic Mexican tacos",
    paymentStatus: "paid"
  },
  {
    id: "ORD-2023-0004",
    date: new Date(2023, 8, 5, 17, 0),
    vendor: "Barstool BBQ",
    vendorImage: "/public/lovable-uploads/11f9528a-dda2-46b9-b183-933ed8329d8f.png",
    location: "Wrigley Field, Chicago, IL",
    status: "cancelled",
    total: 900,
    guests: 60,
    details: "Game day event - cancelled due to weather",
    paymentStatus: "unpaid"
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCancelOrder = () => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'cancelled' as const }
          : order
      ));
      toast({
        title: "Order Cancelled",
        description: `Order ${selectedOrder.id} has been cancelled.`,
        variant: "destructive",
      });
      setShowCancelDialog(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    switch(status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Partial</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Unpaid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Button className="bg-brand-pink hover:bg-pink-700">
          Book a New Truck
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search orders by ID, vendor, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          {(searchQuery || statusFilter !== "all") && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Order {order.id}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" /> 
                      {format(order.date, "MMM d, yyyy")}
                      <Clock className="h-4 w-4 ml-3 mr-1" /> 
                      {format(order.date, "h:mm a")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailsDialog(true);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      {order.status === 'pending' || order.status === 'confirmed' ? (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowCancelDialog(true);
                          }}
                          className="text-red-600"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={order.vendorImage} 
                      alt={order.vendor} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{order.vendor}</h3>
                    <p className="text-gray-500 text-sm">{order.location}</p>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Status:</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Payment:</span>
                  {getPaymentBadge(order.paymentStatus)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 py-3">
                <Button
                  variant="link"
                  className="text-brand-pink w-full"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetailsDialog(true);
                  }}
                >
                  View Order Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Placed on {format(selectedOrder.date, "MMMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-lg overflow-hidden mr-4">
                    <img 
                      src={selectedOrder.vendorImage} 
                      alt={selectedOrder.vendor} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedOrder.vendor}</h3>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" /> 
                      {format(selectedOrder.date, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" /> 
                      {format(selectedOrder.date, "h:mm a")}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p>{selectedOrder.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Number of Guests</h4>
                    <p>{selectedOrder.guests} people</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Order Status</h4>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
                    <div className="mt-1">{getPaymentBadge(selectedOrder.paymentStatus)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Event Details</h4>
                  <p className="mt-1">{selectedOrder.details}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between font-medium text-lg mb-2">
                    <span>Total Amount:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {selectedOrder.paymentStatus === 'partial' && (
                    <div className="flex justify-between text-gray-500">
                      <span>Paid:</span>
                      <span>${(selectedOrder.total * 0.5).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.paymentStatus === 'partial' && (
                    <div className="flex justify-between text-gray-500">
                      <span>Due:</span>
                      <span>${(selectedOrder.total * 0.5).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && 
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowCancelDialog(true);
                    }}
                  >
                    Cancel Order
                  </Button>
                }
                {selectedOrder.paymentStatus === 'partial' && 
                  <Button 
                    className="bg-brand-pink hover:bg-pink-700"
                    onClick={() => {
                      toast({
                        title: "Redirecting to payment",
                        description: "You'll be redirected to complete your payment.",
                      });
                    }}
                  >
                    Complete Payment
                  </Button>
                }
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedOrder && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-medium">Order: {selectedOrder.id}</p>
                <p>Vendor: {selectedOrder.vendor}</p>
                <p>Date: {format(selectedOrder.date, "MMMM d, yyyy")}</p>
                <p>Time: {format(selectedOrder.date, "h:mm a")}</p>
              </div>
            )}
            <p className="mt-4 text-gray-500">
              Cancellation policy: Full refund if cancelled 48 hours before the event. 50% refund if cancelled between 24-48 hours. No refund for cancellations less than 24 hours before the event.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
