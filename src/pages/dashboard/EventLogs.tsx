
import { useState } from "react";
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
import { Info, MoreVertical, Filter, Download, Trash2, RefreshCw, Activity, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
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

const EventLogs = () => {
  // Mock log data
  const generateMockLogs = (): LogEntry[] => {
    const sources = ["API", "Authentication", "Payment", "Booking", "User", "System"];
    const users = ["admin@example.com", "vendor@example.com", "customer@example.com"];
    const messages = [
      "User logged in successfully",
      "Payment processed",
      "Booking created",
      "User profile updated",
      "Password reset requested",
      "File upload failed",
      "API rate limit exceeded",
      "Database connection error",
      "Email notification sent",
      "Security alert: multiple failed login attempts",
    ];
    
    const logs: LogEntry[] = [];
    
    for (let i = 0; i < 50; i++) {
      const level: LogLevel = ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as LogLevel;
      const date = new Date();
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60 * 24 * 7)); // Random time in the last week
      
      logs.push({
        id: `log-${i}`,
        timestamp: date,
        level,
        message: messages[Math.floor(Math.random() * messages.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        user: Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : undefined,
        details: Math.random() > 0.5 ? `Additional details for log entry ${i}` : undefined,
      });
    }
    
    // Sort by timestamp, newest first
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs());
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<string | "all">("all");
  
  const refreshLogs = () => {
    setLogs(generateMockLogs());
    toast.success("Logs refreshed");
  };
  
  const clearLogs = () => {
    setLogs([]);
    toast.success("Logs cleared");
  };
  
  const downloadLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
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
  
  const sources = [...new Set(logs.map(log => log.source))];
  
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
          <Button variant="outline" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={downloadLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="text-red-600" onClick={clearLogs}>
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
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{log.user || "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
