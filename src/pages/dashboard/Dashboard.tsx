
import { useAuth } from "@/contexts/AuthContext";
import ChatWidget from "@/components/chat/ChatWidget";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TagsSection from "@/components/dashboard/TagsSection";
import DailySalesChart from "@/components/dashboard/DailySalesChart";
import PackageSalesTable from "@/components/dashboard/PackageSalesTable";
import SalesReportTable from "@/components/dashboard/SalesReportTable";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">DASHBOARD</h1>
        <Link to="/dashboard/calendar">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar size={16} />
            View Calendar
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <section className="mb-8">
        <SummaryCards />
      </section>

      {/* Tags Section */}
      <section className="mb-8">
        <TagsSection />
      </section>

      {/* Daily Sales Chart */}
      <section className="mb-8">
        <DailySalesChart />
      </section>

      {/* Package Sales */}
      <section className="mb-8">
        <PackageSalesTable />
      </section>

      {/* Sales Report Tabs */}
      <section>
        <SalesReportTable />
      </section>

      <ChatWidget />
    </div>
  );
};

export default Dashboard;
