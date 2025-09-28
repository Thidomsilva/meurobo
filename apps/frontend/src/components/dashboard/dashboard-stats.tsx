"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingUp, Percent, CandlestickChart } from "lucide-react";
import { dashboardStats } from "@/lib/data";
import { useBroker } from "@/contexts/broker-context";
import { Badge } from "@/components/ui/badge";

export function DashboardStats() {
    const { balances, activeAccount } = useBroker();

    const currentBalance = activeAccount === "real" ? balances.real : balances.demo;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balanço</CardTitle>
          <Badge variant={activeAccount === 'real' ? 'default' : 'secondary'}>
            {activeAccount === 'real' ? 'REAL' : 'DEMO'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">
            Saldo atual da conta de {activeAccount === 'real' ? 'operações' : 'demonstração'}.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ganhos (Hoje)
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${dashboardStats.pnlDay >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {dashboardStats.pnlDay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
           <p className="text-xs text-muted-foreground">
            Desempenho da sessão atual
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardStats.winrateDay}%</div>
          <p className="text-xs text-muted-foreground">
            +5.2% que ontem
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trades (Hoje)</CardTitle>
          <CandlestickChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{dashboardStats.tradesDay}</div>
          <p className="text-xs text-muted-foreground">
            Total de operações executadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
