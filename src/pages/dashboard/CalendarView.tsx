
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus
} from "lucide-react";

// Types for events
interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "booking" | "maintenance" | "meeting" | "other";
  description?: string;
  location?: string;
}

// Sample data
const sampleEvents: Event[] = [
  {
    id: "event-1",
    title: "Food Truck Festival",
    date: new Date(2025, 3, 15),
    time: "10:00 AM - 4:00 PM",
    type: "booking",
    description: "Annual food truck festival at City Park",
    location: "City Park, Main Avenue"
  },
  {
    id: "event-2",
    title: "Maintenance Check",
    date: new Date(2025, 3, 10),
    time: "9:00 AM - 11:00 AM",
    type: "maintenance",
    description: "Regular maintenance for all trucks"
  },
  {
    id: "event-3",
    title: "Team Meeting",
    date: new Date(2025, 3, 5),
    time: "1:00 PM - 2:30 PM",
    type: "meeting",
    description: "Monthly team meeting to discuss operations",
    location: "Conference Room A"
  },
  {
    id: "event-4",
    title: "Corporate Event",
    date: new Date(2025, 3, 20),
    time: "11:30 AM - 1:30 PM",
    type: "booking",
    description: "Providing lunch for TechCorp's company event",
    location: "TechCorp HQ, 123 Business Blvd"
  }
];

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  
  // Format dates for display
  const formatDateTitle = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Filter events based on selected date and type
  useEffect(() => {
    let filtered = events;
    
    // Filter by date based on view mode
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.date);
      
      if (viewMode === "day") {
        return eventDate.getDate() === date.getDate() && 
               eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      } else if (viewMode === "week") {
        // Get start and end of week
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      } else {
        // Month view - check if same month and year
        return eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      }
    });
    
    // Filter by event type
    if (filterType !== "all") {
      filtered = filtered.filter(event => event.type === filterType);
    }
    
    setFilteredEvents(filtered);
  }, [date, events, filterType, viewMode]);
  
  // Custom day rendering to show events on the calendar
  const renderDay = (day: Date): React.ReactNode => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() && 
             eventDate.getMonth() === day.getMonth() && 
             eventDate.getFullYear() === day.getFullYear();
    });
    
    return (
      <div className="relative w-full h-full">
        <div>{day.getDate()}</div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className={`h-1.5 w-1.5 rounded-full ${
              dayEvents.some(e => e.type === 'booking') ? 'bg-blue-500' : 
              dayEvents.some(e => e.type === 'maintenance') ? 'bg-orange-500' : 
              dayEvents.some(e => e.type === 'meeting') ? 'bg-purple-500' : 'bg-gray-500'
            }`} />
          </div>
        )}
      </div>
    );
  };
  
  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(date);
    if (viewMode === "day") {
      newDate.setDate(date.getDate() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    setDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(date);
    if (viewMode === "day") {
      newDate.setDate(date.getDate() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    setDate(newDate);
  };
  
  const goToToday = () => {
    setDate(new Date());
  };
  
  // Get the time period description based on view mode
  const getTimePeriodDescription = (): string => {
    if (viewMode === "day") {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
      
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    } else {
      return formatDateTitle(date);
    }
  };
  
  // Event type to color mapping
  const getEventTypeColor = (type: string): string => {
    switch(type) {
      case "booking": return "bg-blue-100 border-blue-500 text-blue-800";
      case "maintenance": return "bg-orange-100 border-orange-500 text-orange-800";
      case "meeting": return "bg-purple-100 border-purple-500 text-purple-800";
      default: return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">CALENDAR VIEW</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Widget */}
        <div className="lg:w-2/5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">
                {formatDateTitle(date)}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border pointer-events-auto"
                showOutsideDays
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToToday}
                  className="text-xs"
                >
                  Today
                </Button>
                <Button 
                  variant={viewMode === "month" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode("month")}
                  className="text-xs"
                >
                  Month
                </Button>
                <Button 
                  variant={viewMode === "week" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode("week")}
                  className="text-xs"
                >
                  Week
                </Button>
                <Button 
                  variant={viewMode === "day" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode("day")}
                  className="text-xs"
                >
                  Day
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Filter by Type</h3>
                <Select 
                  value={filterType} 
                  onValueChange={setFilterType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Event Types</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Bookings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">Maintenance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Meetings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    <span className="text-sm">Other</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Events List */}
        <div className="lg:w-3/5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">
                  {getTimePeriodDescription()}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div 
                      key={event.id}
                      className={`p-4 border-l-4 rounded-r-lg shadow-sm ${getEventTypeColor(event.type)}`}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-white bg-opacity-50">
                          {event.type}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>
                          {event.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                          {' • '}
                          {event.time}
                        </span>
                      </div>
                      {event.location && (
                        <div className="mt-1 text-sm opacity-75">
                          Location: {event.location}
                        </div>
                      )}
                      {event.description && (
                        <div className="mt-2 text-sm">
                          {event.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No events scheduled for this period</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
