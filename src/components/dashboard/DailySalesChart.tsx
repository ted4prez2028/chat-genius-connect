
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/utils/dateUtils";

// Sample data for charts
const dailySalesData = [
  { name: "Mar 30, 2025", sales: 0 },
  { name: "Mar 31, 2025", sales: 0 },
  { name: "Apr 1, 2025", sales: 0 },
  { name: "Apr 2, 2025", sales: 0 },
  { name: "Apr 3, 2025", sales: 0 },
  { name: "Apr 4, 2025", sales: 0 },
  { name: "Apr 5, 2025", sales: 0 },
];

const DailySalesChart = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Custom handler for single date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">DAILY SALES</CardTitle>
        <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md">
          <span>{formatDate(date)}</span>
          <Calendar 
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="hidden" 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#DE2E7D" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySalesChart;
