import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { RecentTrades } from "@/components/dashboard/recent-trades";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { strategies } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Painel" />
      <main className="flex-1 space-y-4 overflow-auto p-4 md:p-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Iniciar Sessão Automática</CardTitle>
              <CardDescription>
                Selecione uma estratégia e defina suas metas para a sessão.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="strategy">Estratégia</Label>
                <Select>
                  <SelectTrigger id="strategy">
                    <SelectValue placeholder="Selecione uma estratégia" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies
                      .filter((s) => s.active)
                      .map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-gain">Stop Gain ($)</Label>
                  <Input id="stop-gain" type="number" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss ($)</Label>
                  <Input id="stop-loss" type="number" placeholder="250" />
                </div>
              </div>
               <Button size="lg" className="w-full">
                  Iniciar Sessão
                </Button>
            </CardContent>
          </Card>
           <div className="hidden lg:block">
              <DashboardStats />
           </div>
        </div>
        
        <div className="block lg:hidden">
            <DashboardStats />
        </div>

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
