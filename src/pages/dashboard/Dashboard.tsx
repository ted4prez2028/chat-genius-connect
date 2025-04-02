
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ChatWidget from "@/components/chat/ChatWidget";
import { DateRange } from "react-day-picker";

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

const packageSalesData = [
  { id: "P-00JA0G", name: "Meat and Cheese Tray", vendor: "Corey's Bagels", price: 0 },
  { id: "P-6B36F", name: "Filet Slider Bar", vendor: "Barstool BBQ", price: 0 },
  { id: "P-JQHPD", name: "Option 2- 1 Dinner Plate per person w/ No Drink", vendor: "Tacos Marios", price: 0 },
  { id: "P-REPSZ", name: "Vegan Smash Party", vendor: "Smash Jibarito", price: 0 },
  { id: "P-YN6QS", name: "Fusion Brunch Bowls", vendor: "Mother Prepper", price: 0 },
  { id: "P-PW45R", name: "LIMONI BELLI 3", vendor: "LIMONI BELLI PIZZERIA", price: 0 },
];

const vendorTags = [
  { name: "american", sales: 0, percentage: 0 },
  { name: "chinese", sales: 0, percentage: 0 },
  { name: "filipino", sales: 0, percentage: 0 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Custom handler for date selection that can be passed to Calendar component
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  // Custom handler for date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">DASHBOARD</h1>

      {/* Summary Cards */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">SALES REPORT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="bg-brand-yellow w-16 h-16 rounded-full flex items-center justify-center">
                    <img src="/public/lovable-uploads/1ca80f99-d4fa-47bf-be5e-0d0fa265612d.png" alt="Bookings" className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-gray-500">Total Bookings</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="bg-brand-yellow w-16 h-16 rounded-full flex items-center justify-center">
                    <img src="/public/lovable-uploads/83930574-48fa-47d4-9ef6-9da8c4ed00a5.png" alt="Sales" className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">$0</div>
                    <div className="text-gray-500">Total Sales</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="bg-brand-yellow w-16 h-16 rounded-full flex items-center justify-center">
                    <img src="/public/lovable-uploads/4759f1b4-060c-4679-baa9-0867042b6629.png" alt="Vendors" className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-gray-500">Total Vendors</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="bg-brand-yellow w-16 h-16 rounded-full flex items-center justify-center">
                    <img src="/public/lovable-uploads/8f3a17ee-e82b-44f4-b17a-f8c1924ba4b2.png" alt="Customers" className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-gray-500">Total Customers</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tags Section */}
      <section className="mb-8">
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
                <span>03/30/2025</span>
                <Calendar 
                  date={date} 
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
      </section>

      {/* Daily Sales Chart */}
      <section className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">DAILY SALES</CardTitle>
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md">
              <span>03/30/2025</span>
              <Calendar 
                date={date} 
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
      </section>

      {/* Package Sales */}
      <section className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">PACKAGE SALES</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span>01/01/2025</span>
                <Calendar 
                  date={dateRange?.from} 
                  onSelect={handleDateSelect} 
                  className="hidden" 
                />
              </div>
              <span>→</span>
              <div className="flex items-center space-x-2">
                <span>04/02/2025</span>
                <Calendar 
                  date={dateRange?.to} 
                  onSelect={handleDateSelect} 
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
      </section>

      {/* Sales Report Tabs */}
      <section>
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
                <span>01/01/2025</span>
                <Calendar 
                  date={dateRange?.from} 
                  onSelect={handleDateSelect} 
                  className="hidden" 
                />
              </div>
              <span>→</span>
              <div className="flex items-center space-x-2">
                <span>04/02/2025</span>
                <Calendar 
                  date={dateRange?.to} 
                  onSelect={handleDateSelect} 
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
      </section>

      <ChatWidget />
    </div>
  );
};

export default Dashboard;
