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

export default function SettingsPage() {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "failed"
  >("disconnected");

  const handleConnect = (event: React.FormEvent) => {
    event.preventDefault();
    setConnectionStatus("connecting");
    setTimeout(() => {
      // Simulate API call result
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        setConnectionStatus("connected");
        toast({
          title: "Connection Successful",
          description: "Your IQOption account has been connected.",
        });
      } else {
        setConnectionStatus("failed");
        toast({
          title: "Connection Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }, 2000);
  };
  
  const handleDisconnect = () => {
    setConnectionStatus("disconnected");
    toast({
        title: "Disconnected",
        description: "Your IQOption account has been disconnected.",
    });
  }

  return (
    <>
      <PageHeader title="Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <Card>
            <CardHeader>
              <CardTitle>IQOption Account</CardTitle>
              <CardDescription>
                Connect your account to enable automated trading. Your credentials are encrypted and stored securely.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleConnect}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="user@example.com" required disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'} />
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
                        {connectionStatus === 'disconnected' && 'Status: Not Connected'}
                        {connectionStatus === 'connecting' && 'Status: Connecting...'}
                        {connectionStatus === 'connected' && 'Status: Connected'}
                        {connectionStatus === 'failed' && 'Status: Connection Failed'}
                    </span>
                </div>
                {connectionStatus === 'connected' ? (
                    <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
                ) : (
                    <Button type="submit" disabled={connectionStatus === 'connecting'}>
                        {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Account'}
                    </Button>
                )}
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your application settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="notifications-switch">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive summaries and alerts via email.</p>
                    </div>
                    <Switch id="notifications-switch" />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="ia-status-switch">Require "IA: ON"</Label>
                        <p className="text-xs text-muted-foreground">Hard block session start if AI service is offline.</p>
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
