'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function OverlayPage() {
  const [selectedBroker, setSelectedBroker] = useState<"iqoption" | "avalon" | "pocketoption">("iqoption");
  const [email, setEmail] = useState("admin@tradealchemist.ai");
  const [password, setPassword] = useState("admin");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [balance, setBalance] = useState("0.00");
  const [currentProfit, setCurrentProfit] = useState("+87%");
  const [wins, setWins] = useState(2);
  const [losses, setLosses] = useState(0);
  const [dailyGoal, setDailyGoal] = useState("100.00");
  const [maxLoss, setMaxLoss] = useState("50.00");
  const [entryValue, setEntryValue] = useState("5.00");
  const [martingales, setMartingales] = useState("3");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://robot-backend.fly.dev';

  const handleConnect = async () => {
    setConnectionStatus("connecting");
    
    const endpoint = selectedBroker === "avalon" ? "/login-avalon" : 
                    selectedBroker === "pocketoption" ? "/login-pocketoption" : 
                    "/login";

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus("connected");
        // Buscar saldo após conexão
        await fetchBalance();
      } else {
        setConnectionStatus("disconnected");
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      alert(`Erro de conexão: ${error}`);
    }
  };

  const fetchBalance = async () => {
    const endpoint = selectedBroker === "avalon" ? "/balance-avalon" : "/balance";
    
    try {
      const response = await fetch(`${apiUrl}${endpoint}`);
      const data = await response.json();
      
      if (data.success && data.balance) {
        setBalance(data.balance.toString());
      }
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
    }
  };

  const winRate = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-4">
      {/* Overlay Compacto - Inspirado na ferramenta do trader */}
      <Card className="w-80 bg-gray-900/95 border-gray-700 shadow-2xl backdrop-blur-sm">
        <div className="p-3 space-y-3">
          {/* Header com Seleção de Broker */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">🤖 MeuRobô</h1>
            <div className="w-28">
              <Select value={selectedBroker} onValueChange={(value: "iqoption" | "avalon" | "pocketoption") => setSelectedBroker(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-xs h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="iqoption" className="text-white text-xs">IQ OPTION</SelectItem>
                  <SelectItem value="avalon" className="text-white text-xs">AVALON</SelectItem>
                  <SelectItem value="pocketoption" className="text-white text-xs">POCKET OPTION</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dashboard Compacto - Estilo da ferramenta */}
          <div className="bg-gray-800/30 border border-gray-600 rounded p-2">
            <div className="grid grid-cols-4 gap-1 text-center text-xs">
              <div>
                <div className="text-green-400 font-bold">R${balance}</div>
                <div className="text-gray-400">Saldo</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold">{currentProfit}</div>
                <div className="text-gray-400">Lucro</div>
              </div>
              <div>
                <div className="text-green-400 font-bold">WINS: {wins}</div>
                <div className="text-red-400 font-bold">LOSS: {losses}</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold">{winRate}%</div>
                <div className="text-gray-400">WINRATE</div>
              </div>
            </div>
          </div>

          {/* Configurações Personalizadas - Estilo XR1 */}
          <div className="bg-gray-800/20 border border-orange-600 rounded p-2">
            <div className="text-center text-orange-400 text-xs font-bold mb-2">PERSONALIZADO</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>
                <label className="text-gray-400">META DE GANHO DO DIA</label>
                <Input 
                  type="number" 
                  value={dailyGoal} 
                  onChange={(e) => setDailyGoal(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white h-6 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-gray-400">PERDA MÁXIMA DO DIA</label>
                <Input 
                  type="number" 
                  value={maxLoss} 
                  onChange={(e) => setMaxLoss(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white h-6 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-gray-400">VALOR DE ENTRADA INICIAL</label>
                <Input 
                  type="number" 
                  value={entryValue} 
                  onChange={(e) => setEntryValue(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white h-6 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-gray-400">QUANTIDADE DE MARTINGALES</label>
                <Input 
                  type="number" 
                  value={martingales} 
                  onChange={(e) => setMartingales(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white h-6 text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Login Fields (só quando desconectado) */}
          {connectionStatus === "disconnected" && (
            <div className="space-y-1">
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white h-7 text-xs"
                placeholder="EMAIL"
              />
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white h-7 text-xs"
                placeholder="SENHA"
              />
            </div>
          )}

          {/* Botão Principal */}
          <div className="space-y-1">
            {connectionStatus === "disconnected" && (
              <Button 
                onClick={handleConnect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-bold"
              >
                CONECTAR
              </Button>
            )}
            
            {connectionStatus === "connecting" && (
              <Button disabled className="w-full h-8 text-xs">
                CONECTANDO...
              </Button>
            )}
            
            {connectionStatus === "connected" && (
              <>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 h-8 text-xs font-bold">
                  CONFIRMAR
                </Button>
                <div className="grid grid-cols-2 gap-1">
                  <Button className="bg-green-600 hover:bg-green-700 h-7 text-xs" size="sm">
                    🤖 IA: ON
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-white h-7 text-xs" size="sm">
                    📊 ANÁLISE
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Status Compacto */}
          <div className="text-center text-xs">
            {connectionStatus === "connected" && (
              <div className="text-green-400">
                ✅ {selectedBroker.toUpperCase()} Funcionando → ESTRATÉGIA-PROBABILIDADE GERENCIAMENTO+ALAVANCAGEM SEM GALE
              </div>
            )}
            {connectionStatus === "disconnected" && (
              <div className="text-gray-400">
                SELECIONE A CORRETORA
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}