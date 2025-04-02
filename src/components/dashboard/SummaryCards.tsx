
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SummaryCards = () => {
  return (
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
  );
};

export default SummaryCards;
