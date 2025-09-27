import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { dashboardStats } from "@/lib/data";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balanço</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${dashboardStats.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ganhos
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${dashboardStats.pnlDay >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${dashboardStats.pnlDay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
