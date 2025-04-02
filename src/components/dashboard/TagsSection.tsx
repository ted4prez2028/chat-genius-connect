
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/utils/dateUtils";

// Sample data for vendor tags
const vendorTags = [
  { name: "american", sales: 0, percentage: 0 },
  { name: "chinese", sales: 0, percentage: 0 },
  { name: "filipino", sales: 0, percentage: 0 },
];

const TagsSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Custom handler for single date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">TAGS</CardTitle>
        <div className="flex space-x-2">
          <Button className="bg-brand-yellow text-brand-brown font-semibold">Cuisine</Button>
          <Button variant="outline">Food Type</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-right">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md">
            <span>{formatDate(date)}</span>
            <Calendar 
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="hidden" 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {vendorTags.map((tag, index) => (
            <div key={index} className="text-center">
              <div className={`w-4 h-4 rounded-full inline-block mr-2 ${index === 0 ? 'bg-blue-400' : index === 1 ? 'bg-cyan-400' : 'bg-teal-400'}`}></div>
              <span className="text-gray-700">{tag.name}</span>
              <div className="text-xl font-bold">{tag.percentage}%</div>
              <div className="text-gray-500">{tag.sales} Sales</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagsSection;
