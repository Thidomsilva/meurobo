"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CandlestickChartComponent } from "@/components/trade/candlestick-chart";
import { PageHeader } from "@/components/layout/page-header";
import { ArrowDown, ArrowUp, Loader } from "lucide-react";
import { useBroker } from "@/contexts/broker-context";

export default function TradePage() {
  const { connectionStatus, fetchAvailablePairs } = useBroker();
  const [activePair, setActivePair] = useState("EURUSD");
  const [availablePairs, setAvailablePairs] = useState<string[]>(["EURUSD"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      setIsLoading(true);
      fetchAvailablePairs()
        .then(pairs => {
          if (pairs.length > 0) {
            setAvailablePairs(pairs);
            if (!pairs.includes(activePair)) {
              setActivePair(pairs[0]);
            }
          }
        })
        .finally(() => setIsLoading(false));
    } else {
        // If not connected, show a default list and stop loading
        setAvailablePairs(["EURUSD"]);
        setActivePair("EURUSD");
        setIsLoading(false);
    }
  }, [connectionStatus, fetchAvailablePairs]);

  return (
    <>
      <PageHeader title={`Operar: ${activePair}`}>
         <Select value={activePair} onValueChange={setActivePair} disabled={isLoading || connectionStatus !== 'connected'}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={isLoading ? "Carregando..." : "Ativo"} />
            </SelectTrigger>
            <SelectContent>
                {isLoading ? (
                    <div className="flex items-center justify-center p-2">
                        <Loader className="w-4 h-4 animate-spin" />
                    </div>
                ) : (
                    availablePairs.map(pair => (
                        <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
      </PageHeader>
      <main className="flex-1 overflow-auto p-4 md:p-8 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-2">
                <CandlestickChartComponent key={activePair} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-4">
             <Card>
              <CardContent className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="value" className="text-sm">Valor</Label>
                    <Input id="value" type="number" defaultValue="10.00" className="font-mono text-base"/>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="expiration" className="text-sm">Expiração</Label>
                    <Select defaultValue="60">
                      <SelectTrigger id="expiration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 seg</SelectItem>
                        <SelectItem value="15">15 seg</SelectItem>
                        <SelectItem value="30">30 seg</SelectItem>
                        <SelectItem value="60">1 min</SelectItem>
                        <SelectItem value="300">5 min</SelectItem>
                        <SelectItem value="900">15 min</SelectItem>
                      </SelectContent>
                    </Select>
                   </div>
                 </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button size="xl" className="w-full h-16 text-lg bg-green-500 hover:bg-green-600 text-white flex-col">
                        <ArrowUp className="w-6 h-6 mb-1" />
                        <span>Compra</span>
                    </Button>
                     <Button size="xl" className="w-full h-16 text-lg bg-red-500 hover:bg-red-600 text-white flex-col">
                        <ArrowDown className="w-6 h-6 mb-1" />
                        <span>Venda</span>
                    </Button>
                  </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="profit-goal" className="text-sm">Meta de Lucro ($)</Label>
                        <Input id="profit-goal" type="number" defaultValue="25.00" className="font-mono text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stop-loss" className="text-sm">Stop Loss ($)</Label>
                        <Input id="stop-loss" type="number" defaultValue="50.00" className="font-mono text-base" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                        <Label htmlFor="protection">Proteção de Ganhos</Label>
                        <p className="text-xs text-muted-foreground">Proteger 50% ao atingir 75% da meta.</p>
                    </div>
                    <Switch id="protection" />
                  </div>
                 <Button size="lg" className="w-full h-12 text-lg">Iniciar Sessão IA</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
