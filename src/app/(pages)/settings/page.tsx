
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

  const handleConnect = (event: React.FormEvent) => {
    event.preventDefault();
    setConnectionStatus("connecting");

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;


    // Simulate API call delay
    setTimeout(() => {
      // Mocked credentials check
      if (email === "admin@tradealchemist.ai" && password === "admin") {
        setConnectionStatus("connected");
        // In a real scenario, these values would be fetched from the broker.
        updateBalances({ real: 15750.25, demo: 10000.00 }); 
        toast({
            title: "Conexão Bem-sucedida",
            description: "Sua conta IQOption foi conectada e os saldos atualizados.",
        });
      } else {
        setConnectionStatus("failed");
        toast({
            variant: "destructive",
            title: "Falha na Conexão",
            description: "Email ou senha inválidos. Verifique suas credenciais.",
        });
      }
    }, 2000);
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
                  <Input id="email" name="email" type="email" placeholder="admin@tradealchemist.ai" required disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" placeholder="admin" required disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'} />
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
