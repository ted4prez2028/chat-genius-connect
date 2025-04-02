
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { formatDate } from "@/utils/dateUtils";

// Sample data for package sales
const packageSalesData = [
  { id: "P-00JA0G", name: "Meat and Cheese Tray", vendor: "Corey's Bagels", price: 0 },
  { id: "P-6B36F", name: "Filet Slider Bar", vendor: "Barstool BBQ", price: 0 },
  { id: "P-JQHPD", name: "Option 2- 1 Dinner Plate per person w/ No Drink", vendor: "Tacos Marios", price: 0 },
  { id: "P-REPSZ", name: "Vegan Smash Party", vendor: "Smash Jibarito", price: 0 },
  { id: "P-YN6QS", name: "Fusion Brunch Bowls", vendor: "Mother Prepper", price: 0 },
  { id: "P-PW45R", name: "LIMONI BELLI 3", vendor: "LIMONI BELLI PIZZERIA", price: 0 },
];

const PackageSalesTable = () => {
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
        <CardTitle className="text-2xl">PACKAGE SALES</CardTitle>
        <div className="flex items-center space-x-4">
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
            <tbody>
              {packageSalesData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-4 px-2 border-b">{item.id}</td>
                  <td className="py-4 px-2 border-b">
                    <div>{item.name}</div>
                    <div className="text-sm text-gray-500">{item.vendor}</div>
                  </td>
                  <td className="py-4 px-2 border-b text-right">
                    <div className="inline-block bg-green-100 text-green-800 rounded-full px-4 py-1 border border-green-300">
                      $ {item.price}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageSalesTable;
