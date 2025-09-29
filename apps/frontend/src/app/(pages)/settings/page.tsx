
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useBroker } from "@/contexts/broker-context";

export default function SettingsPage() {
  const { toast } = useToast();
  const { connectionStatus, setConnectionStatus, updateBalances } = useBroker();
  const [email, setEmail] = useState("admin@tradealchemist.ai");
  const [password, setPassword] = useState("admin");
  const [selectedBroker, setSelectedBroker] = useState<"iqoption" | "avalon" | "pocketoption">("iqoption");


  const handleConnect = (event: React.FormEvent) => {
    event.preventDefault();
    setConnectionStatus("connecting");

    // Debug da URL
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    // Determinar endpoint baseado no broker selecionado
    const endpoint = selectedBroker === "avalon" ? "/login-avalon" : 
                    selectedBroker === "pocketoption" ? "/login-pocketoption" : 
                    "/login";
    console.log('Using URL:', `${apiUrl}${endpoint}`);

    // Chamada real para o backend
  fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setConnectionStatus("connected");
          
          // Buscar saldo baseado no broker selecionado
          if (selectedBroker === "iqoption") {
            // Para IQOption, tentar buscar saldo
            fetch(`${apiUrl}/balance`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            })
              .then(async (res) => {
                const balanceData = await res.json();
                if (balanceData.success) {
                  updateBalances(balanceData.balance);
                }
              })
              .catch(err => console.log('Erro ao buscar saldo IQOption:', err));
          } else if (selectedBroker === "avalon") {
            // Para Avalon, buscar saldo específico
            fetch(`${apiUrl}/balance-avalon`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            })
              .then(async (res) => {
                const balanceData = await res.json();
                console.log('Resposta saldo Avalon:', balanceData);
                if (balanceData.success && balanceData.balance !== undefined) {
                  updateBalances(balanceData.balance);
                  toast({
                    title: "Saldo Atualizado",
                    description: `Saldo: ${balanceData.balance} ${balanceData.currency || 'USD'}`,
                  });
                }
              })
              .catch(err => console.log('Erro ao buscar saldo Avalon:', err));
              
            // Também buscar pares disponíveis
            fetch(`${apiUrl}/pairs-avalon`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            })
              .then(async (res) => {
                const pairsData = await res.json();
                console.log('Resposta pares Avalon:', pairsData);
                if (pairsData.success && pairsData.pairs?.length > 0) {
                  toast({
                    title: "Pares Carregados",
                    description: `${pairsData.pairs.length} pares disponíveis: ${pairsData.pairs.slice(0, 3).join(', ')}...`,
                  });
                }
              })
              .catch(err => console.log('Erro ao buscar pares Avalon:', err));
          }
          
          const brokerName = selectedBroker === "avalon" ? "Avalon Broker" : 
                            selectedBroker === "pocketoption" ? "Pocket Option" : 
                            "IQOption";
          toast({
            title: "Conexão Bem-sucedida",
            description: `Sua conta ${brokerName} foi conectada com sucesso.`,
          });
        } else {
          setConnectionStatus("failed");
          toast({
            variant: "destructive",
            title: "Falha na Conexão",
            description: data.message || "Email ou senha inválidos. Verifique suas credenciais.",
          });
        }
      })
      .catch(() => {
        setConnectionStatus("failed");
        toast({
          variant: "destructive",
          title: "Falha na Conexão",
          description: "Erro ao conectar com o backend.",
        });
      });
  };
  
  const handleDisconnect = () => {
    setConnectionStatus("disconnected");
    const brokerName = selectedBroker === "avalon" ? "Avalon Broker" : 
                      selectedBroker === "pocketoption" ? "Pocket Option" : 
                      "IQOption";
    toast({
        title: "Desconectado",
        description: `Sua conta ${brokerName} foi desconectada.`,
    });
  }

  return (
    <>
      <PageHeader title="Configurações" />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conexão com Broker</CardTitle>
              <CardDescription>
                Conecte sua conta para habilitar o trading automatizado. Suas credenciais são criptografadas e armazenadas com segurança.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleConnect}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="broker">Broker</Label>
                  <select 
                    id="broker" 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedBroker}
                    onChange={(e) => setSelectedBroker(e.target.value as "iqoption" | "avalon" | "pocketoption")}
                    disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
                  >
                    <option value="iqoption">IQOption</option>
                    <option value="avalon">Avalon Broker</option>
                    <option value="pocketoption">Pocket Option</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="admin@tradealchemist.ai" required disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" required disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                    {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {connectionStatus === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                    {(connectionStatus === 'connecting') && <Loader className="w-4 h-4 animate-spin" />}
                    <span className={
                        connectionStatus === 'connected' ? 'text-green-500' :
                        connectionStatus === 'failed' ? 'text-red-500' :
                        'text-muted-foreground'
                    }>
                        {connectionStatus === 'disconnected' && 'Status: Não Conectado'}
                        {connectionStatus === 'connecting' && 'Status: Conectando...'}
                        {connectionStatus === 'connected' && 'Status: Conectado'}
                        {connectionStatus === 'failed' && 'Status: Falha na Conexão'}
                    </span>
                </div>
                {connectionStatus === 'connected' ? (
                    <Button variant="destructive" type="button" onClick={handleDisconnect}>Desconectar</Button>
                ) : (
                    <Button type="submit" disabled={connectionStatus === 'connecting'}>
                        {connectionStatus === 'connecting' ? 'Conectando...' : 'Conectar Conta'}
                    </Button>
                )}
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Gerencie as configurações da sua aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="notifications-switch">Notificações por Email</Label>
                        <p className="text-xs text-muted-foreground">Receba resumos e alertas por email.</p>
                    </div>
                    <Switch id="notifications-switch" />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="ia-status-switch">Exigir "IA: ON"</Label>
                        <p className="text-xs text-muted-foreground">Bloquear início de sessão se o serviço de IA estiver offline.</p>
                    </div>
                    <Switch id="ia-status-switch" defaultChecked disabled />
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
