
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, MoreVertical, Filter, Download, Trash2, RefreshCw, Activity, AlertTriangle, CheckCircle, Search, Clock } from "lucide-react";
import { formatDate, formatDistanceToNow } from "@/utils/dateUtils";
import { toast } from "sonner";

type LogLevel = "info" | "warning" | "error" | "success";

type LogEntry = {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source: string;
  user?: string;
  details?: string;
};

// Constant real-world event patterns for more realism
const EVENT_PATTERNS = [
  { message: "User login successful", level: "success", source: "Authentication" },
  { message: "User login failed - incorrect password", level: "warning", source: "Authentication" },
  { message: "Payment processed successfully", level: "success", source: "Payment" },
  { message: "Payment failed - insufficient funds", level: "error", source: "Payment" },
  { message: "New booking created", level: "info", source: "Booking" },
  { message: "Booking updated", level: "info", source: "Booking" },
  { message: "Booking cancelled", level: "warning", source: "Booking" },
  { message: "New user registered", level: "success", source: "User" },
  { message: "Profile updated", level: "info", source: "User" },
  { message: "Password reset requested", level: "info", source: "Authentication" },
  { message: "Password reset completed", level: "success", source: "Authentication" },
  { message: "File upload failed - size limit exceeded", level: "error", source: "System" },
  { message: "API rate limit warning", level: "warning", source: "API" },
  { message: "Database connection error", level: "error", source: "System" },
  { message: "Email notification sent", level: "info", source: "Notification" },
  { message: "Multiple failed login attempts detected", level: "warning", source: "Security" },
  { message: "Session expired", level: "info", source: "Authentication" },
  { message: "User permissions updated", level: "info", source: "User" },
  { message: "System backup completed", level: "success", source: "System" },
  { message: "API endpoint deprecated", level: "warning", source: "API" },
];

const USER_EMAILS = [
  "admin@foodtruck.com",
  "vendor@streetfood.com",
  "customer@example.com",
  "support@foodtruck.com",
  "johndoe@gmail.com",
  "sarah.vendor@tacoexpress.com",
  "mike.customer@outlook.com"
];

const EventLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  
  // Generate initial logs
  useEffect(() => {
    const generateInitialLogs = () => {
      setLoading(true);
      
      const newLogs: LogEntry[] = [];
      const now = new Date();
      
      // Generate logs over the past 7 days
      for (let i = 0; i < 50; i++) {
        const hoursAgo = Math.random() * 24 * 7; // Random time in the last week
        const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
        
        const eventPattern = EVENT_PATTERNS[Math.floor(Math.random() * EVENT_PATTERNS.length)];
        const userEmail = Math.random() > 0.3 ? USER_EMAILS[Math.floor(Math.random() * USER_EMAILS.length)] : undefined;
        
        newLogs.push({
          id: `log-${i}-${timestamp.getTime()}`,
          timestamp,
          level: eventPattern.level as LogLevel,
          message: eventPattern.message,
          source: eventPattern.source,
          user: userEmail,
          details: Math.random() > 0.5 ? `Additional details for ${eventPattern.message} at ${timestamp.toISOString()}` : undefined,
        });
      }
      
      // Sort by timestamp, newest first
      newLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setLogs(newLogs);
      setLoading(false);
    };
    
    generateInitialLogs();
  }, []);
  
  // Simulate real-time log updates
  useEffect(() => {
    if (!isLiveUpdating) return;
    
    const generateRandomLog = () => {
      const eventPattern = EVENT_PATTERNS[Math.floor(Math.random() * EVENT_PATTERNS.length)];
      const userEmail = Math.random() > 0.3 ? USER_EMAILS[Math.floor(Math.random() * USER_EMAILS.length)] : undefined;
      
      return {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date(),
        level: eventPattern.level as LogLevel,
        message: eventPattern.message,
        source: eventPattern.source,
        user: userEmail,
        details: Math.random() > 0.5 ? `Additional details for ${eventPattern.message} at ${new Date().toISOString()}` : undefined,
      };
    };
    
    const interval = setInterval(() => {
      // 15% chance of generating a new log entry
      if (Math.random() < 0.15) {
        const newLog = generateRandomLog();
        setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]); // Keep max 100 logs
        
        if (
          (levelFilter === "all" || newLog.level === levelFilter) &&
          (sourceFilter === "all" || newLog.source === sourceFilter) &&
          (!searchTerm || 
            newLog.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (newLog.user && newLog.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
            newLog.source.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) {
          const levelText = newLog.level.charAt(0).toUpperCase() + newLog.level.slice(1);
          toast(`New ${levelText} Log: ${newLog.message}`, {
            description: `Source: ${newLog.source}${newLog.user ? ` • User: ${newLog.user}` : ''}`,
            icon: getLevelIcon(newLog.level)
          });
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLiveUpdating, levelFilter, sourceFilter, searchTerm]);
  
  const toggleLiveUpdates = () => {
    setIsLiveUpdating(!isLiveUpdating);
    toast.success(isLiveUpdating ? "Live updates paused" : "Live updates enabled");
  };
  
  const refreshLogs = () => {
    // Clear and regenerate logs
    setLogs([]);
    
    setTimeout(() => {
      const newLogs: LogEntry[] = [];
      const now = new Date();
      
      for (let i = 0; i < 50; i++) {
        const hoursAgo = Math.random() * 24 * 7;
        const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
        
        const eventPattern = EVENT_PATTERNS[Math.floor(Math.random() * EVENT_PATTERNS.length)];
        const userEmail = Math.random() > 0.3 ? USER_EMAILS[Math.floor(Math.random() * USER_EMAILS.length)] : undefined;
        
        newLogs.push({
          id: `log-${i}-${timestamp.getTime()}`,
          timestamp,
          level: eventPattern.level as LogLevel,
          message: eventPattern.message,
          source: eventPattern.source,
          user: userEmail,
          details: Math.random() > 0.5 ? `Additional context for ${eventPattern.message}` : undefined,
        });
      }
      
      newLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setLogs(newLogs);
      toast.success("Logs refreshed");
    }, 500);
  };
  
  const clearLogs = () => {
    setLogs([]);
    toast.success("Logs cleared");
  };
  
  const downloadLogs = () => {
    const jsonStr = JSON.stringify(logs, (key, value) => {
      if (key === 'timestamp') {
        return new Date(value).toISOString();
      }
      return value;
    }, 2);
    
    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = href;
    link.download = `event-logs-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Logs downloaded successfully");
  };
  
  // Get unique sources from logs
  const sources = [...new Set(logs.map(log => log.source))];
  
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
                         log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesSource = sourceFilter === "all" || log.source === sourceFilter;
    
    return matchesSearch && matchesLevel && matchesSource;
  });
  
  const getLevelIcon = (level: LogLevel) => {
    switch(level) {
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error": return <Activity className="h-4 w-4 text-red-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getLevelBadge = (level: LogLevel) => {
    switch(level) {
      case "info": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>;
      case "warning": return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>;
      case "error": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case "success": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">EVENT LOGS</h1>
          <p className="text-muted-foreground mt-2">View and manage system event logs</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isLiveUpdating ? "default" : "outline"} 
            onClick={toggleLiveUpdates}
            className={isLiveUpdating ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Clock className={`h-4 w-4 mr-2 ${isLiveUpdating ? "animate-pulse" : ""}`} />
            {isLiveUpdating ? "Live" : "Enable Live Updates"}
          </Button>
          <Button variant="outline" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={downloadLogs} disabled={logs.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="text-red-600" onClick={clearLogs} disabled={logs.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search logs..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {levelFilter === "all" ? "All Levels" : `Level: ${levelFilter.charAt(0).toUpperCase() + levelFilter.slice(1)}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLevelFilter("all")}>All Levels</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevelFilter("info")}>
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevelFilter("success")}>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Success
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevelFilter("warning")}>
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  Warning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevelFilter("error")}>
                  <Activity className="h-4 w-4 text-red-500 mr-2" />
                  Error
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {sourceFilter === "all" ? "All Sources" : `Source: ${sourceFilter}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSourceFilter("all")}>All Sources</DropdownMenuItem>
                {sources.map(source => (
                  <DropdownMenuItem key={source} onClick={() => setSourceFilter(source)}>
                    {source}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Level</TableHead>
                <TableHead className="w-48">Timestamp</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-32">Source</TableHead>
                <TableHead className="w-48">User</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full h-5 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-5 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <TableRow key={log.id} className="group">
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">{formatDate(log.timestamp)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(log.timestamp)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {log.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.user || (
                        <span className="text-muted-foreground text-sm">System</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {log.details && (
                            <>
                              <DropdownMenuItem onClick={() => toast.info(log.details)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => {
                            setLogs(logs.filter(l => l.id !== log.id));
                            toast.success("Log entry removed");
                          }}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No log entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EventLogs;
