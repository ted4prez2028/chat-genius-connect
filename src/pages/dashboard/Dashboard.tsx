
import { useAuth } from "@/contexts/AuthContext";
import ChatWidget from "@/components/chat/ChatWidget";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TagsSection from "@/components/dashboard/TagsSection";
import DailySalesChart from "@/components/dashboard/DailySalesChart";
import PackageSalesTable from "@/components/dashboard/PackageSalesTable";
import SalesReportTable from "@/components/dashboard/SalesReportTable";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">DASHBOARD</h1>

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
