
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentTrades } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

export default function HistoryPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return (
    <>
      <PageHeader title="Histórico de Trades">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                    {format(date.to, "LLL dd, y", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "LLL dd, y", { locale: ptBR })
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </PageHeader>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Operações Realizadas</CardTitle>
                <CardDescription>
                    Um registro detalhado de todas as suas operações no período selecionado.
                </CardDescription>
            </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Direção</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Expiração</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead className="text-right">P/L ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{format(trade.ts, "dd/MM/yy HH:mm:ss")}</TableCell>
                    <TableCell>{trade.pair}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          trade.side === "CALL"
                            ? "border-green-500 text-green-500"
                            : "border-red-500 text-red-500"
                        )}
                      >
                         <div className="flex items-center">
                            {trade.side === "CALL" ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                            {trade.side}
                         </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{trade.stake.toFixed(2)}</TableCell>
                    <TableCell>{trade.expirationSec}s</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-white",
                          trade.result === "win" && "bg-green-500",
                          trade.result === "loss" && "bg-red-500",
                          trade.result === "void" && "bg-gray-500"
                        )}
                      >
                        {trade.result.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        trade.pnl > 0 && "text-green-500",
                        trade.pnl < 0 && "text-red-500"
                      )}
                    >
                      {trade.pnl.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
