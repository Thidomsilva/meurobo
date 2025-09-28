
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


  const handleConnect = (event: React.FormEvent) => {
    event.preventDefault();
    setConnectionStatus("connecting");

    // Chamada real para o backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setConnectionStatus("connected");
          // Opcional: buscar saldo real após login
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
            .then(async (res) => {
              const balanceData = await res.json();
              if (balanceData.success) {
                updateBalances(balanceData.balance);
              }
            });
          toast({
            title: "Conexão Bem-sucedida",
            description: "Sua conta IQOption foi conectada e os saldos atualizados.",
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
    // We keep the last known balances displayed, just update status
    toast({
        title: "Desconectado",
        description: "Sua conta IQOption foi desconectada.",
    });
  }

  return (
    <>
      <PageHeader title="Configurações" />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conta IQOption</CardTitle>
              <CardDescription>
                Conecte sua conta para habilitar o trading automatizado. Suas credenciais são criptografadas e armazenadas com segurança.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleConnect}>
              <CardContent className="space-y-4">
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
