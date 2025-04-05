
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Search, CalendarIcon, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { vendors, getVendorById } from "@/data/vendors";

interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  time: string;
  duration: string;
  guests: string;
  status: string;
  totalAmount: number;
  specialRequests: string;
  createdAt: Date;
}

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("foodtruck_orders");
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        setFilteredOrders(parsedOrders);
      } catch (e) {
        console.error("Failed to parse saved orders:", e);
      }
    } else {
      // If there are no orders yet, create sample data
      if (!isAuthenticated) {
        const sampleOrders = [
          {
            id: "FT123456",
            vendorId: "v1",
            vendorName: "Urban Taco",
            date: "June 15, 2025",
            time: "6:00 PM",
            duration: "3 hours",
            guests: "50",
            status: "Confirmed",
            totalAmount: 900,
            specialRequests: "Vegetarian options required",
            createdAt: new Date(2025, 5, 1)
          },
          {
            id: "FT789012",
            vendorId: "v4",
            vendorName: "Sushi Roll",
            date: "July 3, 2025",
            time: "12:00 PM",
            duration: "2 hours",
            guests: "30",
            status: "Pending",
            totalAmount: 750,
            specialRequests: "None",
            createdAt: new Date(2025, 6, 1)
          },
          {
            id: "FT345678",
            vendorId: "v2",
            vendorName: "Smokin' BBQ",
            date: "May 20, 2025",
            time: "4:00 PM",
            duration: "4 hours",
            guests: "100",
            status: "Completed",
            totalAmount: 1500,
            specialRequests: "Need extra tables and serving staff",
            createdAt: new Date(2025, 4, 1)
          }
        ];
        
        setOrders(sampleOrders);
        setFilteredOrders(sampleOrders);
        localStorage.setItem("foodtruck_orders", JSON.stringify(sampleOrders));
      }
    }
  }, [isAuthenticated]);

  // Apply filters
  useEffect(() => {
    let results = orders;
    
    // Filter by tab
    if (activeTab === "upcoming") {
      results = results.filter(order => order.status === "Confirmed" || order.status === "Pending");
    } else if (activeTab === "completed") {
      results = results.filter(order => order.status === "Completed");
    } else if (activeTab === "cancelled") {
      results = results.filter(order => order.status === "Cancelled");
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        order =>
          order.id.toLowerCase().includes(query) ||
          order.vendorName.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      results = results.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(results);
  }, [orders, searchQuery, statusFilter, activeTab]);

  const handleCancelOrder = (orderId: string) => {
    // Find the order and update its status
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    );
    
    // Update state and save to localStorage
    setOrders(updatedOrders);
    localStorage.setItem("foodtruck_orders", JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">Your Orders</h1>
      <p className="text-gray-500 text-center mb-12">
        {isAuthenticated 
          ? "Manage and track your food truck bookings"
          : "Sign in to manage your orders or browse our sample orders below"}
      </p>
      
      {!isAuthenticated && (
        <div className="max-w-lg mx-auto mb-12 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign In to View Your Orders</h2>
          <p className="text-gray-600 mb-4">Create an account or sign in to access your personal order history and bookings.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
            <Button className="bg-brand-pink hover:bg-pink-700" onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex justify-end">
            <Button 
              className="bg-brand-pink hover:bg-pink-700"
              onClick={() => navigate("/book")}
            >
              Book a Truck
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderOrders()}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            {renderOrders()}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {renderOrders()}
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-0">
            {renderOrders()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
  
  function renderOrders() {
    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab !== "all"
              ? `You don't have any ${activeTab} orders.`
              : "No orders match your search criteria."}
          </p>
          <Button 
            className="bg-brand-pink hover:bg-pink-700"
            onClick={() => navigate("/book")}
          >
            Book a Food Truck
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 p-6 bg-gray-50 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span 
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">Order #{order.id}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{order.vendorName}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{order.date}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{order.time} • {order.duration}</span>
                </div>
                
                <div className="mt-4 text-2xl font-bold">
                  ${order.totalAmount}
                </div>
              </div>
              
              <CardContent className="p-6 md:w-3/4">
                <div className="flex flex-wrap gap-4 justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Guest Count</h3>
                    <p>{order.guests} guests</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Special Requests</h3>
                    <p>{order.specialRequests}</p>
                  </div>
                  
                  <div className="flex items-end gap-4 mt-auto">
                    {order.status === "Confirmed" && (
                      <>
                        <Button variant="outline" asChild>
                          <Link to={`/book?vendor=${order.vendorId}&orderId=${order.id}`}>
                            Modify
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel Order
                        </Button>
                      </>
                    )}
                    {order.status === "Completed" && (
                      <Button variant="outline" asChild>
                        <Link to={`/book?vendor=${order.vendorId}`}>
                          Book Again
                        </Link>
                      </Button>
                    )}
                    {order.status === "Cancelled" && (
                      <Button
                        className="bg-brand-pink hover:bg-pink-700"
                        asChild
                      >
                        <Link to={`/book?vendor=${order.vendorId}`}>
                          Re-book
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }
};

export default Orders;
