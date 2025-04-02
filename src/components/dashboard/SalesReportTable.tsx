
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { formatDate } from "@/utils/dateUtils";

const SalesReportTable = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1), // January 1, 2025
    to: new Date(2025, 3, 2)    // April 2, 2025
  });

  // Custom handler for date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">SALES REPORT</CardTitle>
        <div className="flex items-center space-x-4">
          <Tabs defaultValue="events">
            <TabsList>
              <TabsTrigger value="events" className="bg-brand-yellow text-brand-brown">Events</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <span>{formatDate(dateRange?.from)}</span>
            <Calendar 
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              className="hidden" 
            />
          </div>
          <span>→</span>
          <div className="flex items-center space-x-2">
            <span>{formatDate(dateRange?.to)}</span>
            <Calendar 
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              className="hidden" 
            />
          </div>
          
          <Button className="bg-brand-yellow text-brand-brown font-semibold flex items-center space-x-2">
            <Download size={16} />
            <span>DOWNLOAD CSV</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-2 text-left">Customer</th>
                <th className="py-4 px-2 text-left">Order ID</th>
                <th className="py-4 px-2 text-left">Total Orders</th>
                <th className="py-4 px-2 text-left">Guest Count</th>
                <th className="py-4 px-2 text-left">Total Sales</th>
                <th className="py-4 px-2 text-left">Net Sales</th>
                <th className="py-4 px-2 text-left">Tax</th>
                <th className="py-4 px-2 text-left">Gratuity</th>
                <th className="py-4 px-2 text-left">FTD Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500">
                  No Data To Show
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>Show 5</option>
              <option>Show 10</option>
              <option>Show 20</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 border rounded bg-gray-200">&lt;&lt;</button>
            <button className="p-2 border rounded bg-gray-200">&lt;</button>
            <span className="mx-4">Page: 1</span>
            <button className="p-2 border rounded bg-gray-200">&gt;</button>
            <button className="p-2 border rounded bg-gray-200">&gt;&gt;</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesReportTable;
