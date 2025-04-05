
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check, Clock, Users, Utensils } from "lucide-react";
import { vendors, getVendorById, Vendor } from "@/data/vendors";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BookTruck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Parse vendor ID from URL parameter
  const params = new URLSearchParams(location.search);
  const initialVendorId = params.get("vendor");
  
  const [selectedVendorId, setSelectedVendorId] = useState<string>(initialVendorId || "");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [duration, setDuration] = useState<string>("2");
  const [guestCount, setGuestCount] = useState<string>("30");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [contactName, setContactName] = useState<string>(user?.name || "");
  const [contactEmail, setContactEmail] = useState<string>(user?.email || "");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Time slots for selection
  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", 
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];
  
  // Update selected vendor when ID changes
  useEffect(() => {
    if (selectedVendorId) {
      const vendor = getVendorById(selectedVendorId);
      setSelectedVendor(vendor || null);
    } else {
      setSelectedVendor(null);
    }
  }, [selectedVendorId]);

  // Calculate price based on selections
  const calculatePrice = () => {
    if (!selectedVendor) return 0;
    
    // Base price per hour depends on the vendor's price range
    const basePricePerHour = 
      selectedVendor.priceRange === "$" ? 250 :
      selectedVendor.priceRange === "$$" ? 400 :
      selectedVendor.priceRange === "$$$" ? 650 : 400;
    
    // Calculate based on duration and guest count
    const durationHours = Number(duration);
    const guests = Number(guestCount);
    
    let price = basePricePerHour * durationHours;
    
    // Add fee for larger events
    if (guests > 50) {
      price += 150;
    } else if (guests > 100) {
      price += 300;
    }
    
    return price;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedVendorId) {
      toast.error("Please select a food truck");
      return;
    }
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!timeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    
    if (!contactName || !contactEmail || !contactPhone) {
      toast.error("Please fill in all contact information");
      return;
    }
    
    // Process booking
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate order ID
      const orderId = "FT" + Math.floor(100000 + Math.random() * 900000);
      
      // Format date for display
      const formattedDate = format(date, "MMMM d, yyyy");
      
      // Create order object
      const newOrder = {
        id: orderId,
        vendorId: selectedVendorId,
        vendorName: selectedVendor?.name || "",
        date: formattedDate,
        time: timeSlot,
        duration: `${duration} ${Number(duration) === 1 ? 'hour' : 'hours'}`,
        guests: guestCount,
        status: "Confirmed",
        totalAmount: calculatePrice(),
        specialRequests: specialRequests || "None",
        createdAt: new Date(),
      };
      
      // Get existing orders from localStorage or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem("foodtruck_orders") || "[]");
      
      // Add new order
      const updatedOrders = [newOrder, ...existingOrders];
      
      // Save to localStorage
      localStorage.setItem("foodtruck_orders", JSON.stringify(updatedOrders));
      
      // Reset form
      setIsSubmitting(false);
      
      // Show success message
      toast.success("Booking successful! Order #" + orderId);
      
      // Redirect to orders page
      navigate("/orders");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">Book a Food Truck</h1>
      <p className="text-gray-500 text-center mb-12">Fill out the form below to book a food truck for your event</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Food Truck</label>
                    <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a food truck" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            <div className="flex items-center">
                              <Utensils className="h-4 w-4 mr-2" /> 
                              {vendor.name} - {vendor.cuisineType}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => {
                              // Disable dates in the past
                              return date < new Date(new Date().setHours(0, 0, 0, 0));
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {time}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="3">3 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="5">5 hours</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                          <SelectItem value="8">8 hours (Full Day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Guests</label>
                      <Select value={guestCount} onValueChange={setGuestCount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guest count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">Up to 10 guests</SelectItem>
                          <SelectItem value="30">10-30 guests</SelectItem>
                          <SelectItem value="50">30-50 guests</SelectItem>
                          <SelectItem value="100">50-100 guests</SelectItem>
                          <SelectItem value="200">100-200 guests</SelectItem>
                          <SelectItem value="300">200+ guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Special Requests</label>
                    <Textarea 
                      placeholder="Any dietary restrictions, special menu requests, or setup requirements..."
                      className="min-h-[100px]"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input 
                        placeholder="Full Name" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input 
                      type="tel" 
                      placeholder="Phone Number" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <Button 
                type="submit" 
                className="bg-brand-pink hover:bg-pink-700 w-full md:w-1/2 text-lg py-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </form>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVendor ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img 
                        src={selectedVendor.imageUrl} 
                        alt={selectedVendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedVendor.name}</h3>
                      <p className="text-sm text-gray-500">{selectedVendor.cuisineType}</p>
                    </div>
                  </div>
                  
                  {date && timeSlot && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span>{format(date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{timeSlot} ({duration} {Number(duration) === 1 ? 'hour' : 'hours'})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{guestCount} guests</span>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Popular Menu Items</h3>
                    <ul className="space-y-2">
                      {selectedVendor.popularItems.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Dietary Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.dietaryOptions.map((option, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>${calculatePrice()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Service Fee</span>
                      <span>Included</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${calculatePrice()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Utensils className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium mb-2">Select a Food Truck</h3>
                  <p className="text-sm text-gray-500">Choose a food truck to see booking details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookTruck;
