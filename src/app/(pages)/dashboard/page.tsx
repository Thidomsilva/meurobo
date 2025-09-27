import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { RecentTrades } from "@/components/dashboard/recent-trades";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard">
        <div className="hidden md:block">
          <Button>Start Session</Button>
        </div>
      </PageHeader>
      <main className="flex-1 space-y-4 overflow-auto p-4 md:p-8">
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <EquityChart />
          </div>
          <div className="col-span-4 lg:col-span-3">
            <RecentTrades />
          </div>
        </div>
      </main>
    </>
  );
}
