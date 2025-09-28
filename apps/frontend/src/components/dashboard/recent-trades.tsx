import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recentTrades } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export function RecentTrades() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>
          A log of your most recent automated trades.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[280px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>AI Pred.</TableHead>
                <TableHead className="text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>
                    <div className="font-medium">{trade.pair}</div>
                    <div className="text-xs text-muted-foreground flex items-center">
                        {trade.side === "CALL" ? <ArrowUp className="w-3 h-3 text-green-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
                        <span className="ml-1">${trade.stake}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">
                      {trade.side === "CALL"
                        ? `${(trade.ml.pUp * 100).toFixed(1)}%`
                        : `${(trade.ml.pDown * 100).toFixed(1)}%`}
                    </div>
                     <div className="text-xs text-muted-foreground font-mono">
                      +/- {(trade.ml.uncertainty * 100).toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn("font-medium",
                        trade.result === 'win' && 'text-green-500',
                        trade.result === 'loss' && 'text-red-500',
                        trade.result === 'void' && 'text-muted-foreground'
                    )}>
                        {trade.result === 'win' && `+${trade.pnl.toFixed(2)}`}
                        {trade.result === 'loss' && `${trade.pnl.toFixed(2)}`}
                        {trade.result === 'void' && 'Void'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {trade.ts.toLocaleTimeString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
