import { PageHeader } from "@/components/layout/page-header";
import { CreateStrategyDialog } from "@/components/strategies/create-strategy-dialog";
import { StrategyList } from "@/components/strategies/strategy-list";

export default function StrategiesPage() {
  return (
    <>
      <PageHeader title="Strategies">
        <CreateStrategyDialog />
      </PageHeader>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <StrategyList />
      </main>
    </>
  );
}
