"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { aiModels } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Bot, Cpu, GitBranch, ArrowUp, Send } from "lucide-react";
import type { AiModel } from "@/lib/data";

export default function ModelsPage() {
  const { toast } = useToast();
  const [models, setModels] = useState<AiModel[]>(aiModels);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleSetProduction = (modelId: string) => {
    setLoading(prev => ({ ...prev, [modelId]: true }));
    setTimeout(() => {
      setModels(currentModels =>
        currentModels.map(m => {
          if (m.id === modelId) return { ...m, status: 'production' };
          if (m.status === 'production') return { ...m, status: 'archived' };
          return m;
        })
      );
      setLoading(prev => ({ ...prev, [modelId]: false }));
      toast({
        title: "Modelo Promovido",
        description: `O modelo ${modelId} agora está em produção.`,
      });
    }, 1500);
  };
  
  const handleRetrain = () => {
    setLoading(prev => ({ ...prev, retrain: true }));
     setTimeout(() => {
      setLoading(prev => ({ ...prev, retrain: false }));
      toast({
        title: "Retreinamento Iniciado",
        description: "Um novo processo de retreinamento de modelo foi iniciado.",
      });
    }, 2500);
  };

  const getStatusLabel = (status: "production" | "staging" | "archived") => {
    switch (status) {
      case "production": return "Produção";
      case "staging": return "Staging";
      case "archived": return "Arquivado";
    }
  }


  return (
    <>
      <PageHeader title="Modelos de IA">
        <Button onClick={handleRetrain} disabled={loading['retrain']}>
          {loading['retrain'] ? <Cpu className="mr-2 h-4 w-4 animate-spin" /> : <GitBranch className="mr-2 h-4 w-4" />}
          Iniciar Retreinamento
        </Button>
      </PageHeader>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Card key={model.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            {model.id}
                        </CardTitle>
                        <CardDescription>Tipo: {model.type.toUpperCase()}</CardDescription>
                    </div>
                    <Badge variant={
                        model.status === 'production' ? 'default' :
                        model.status === 'staging' ? 'secondary' : 'outline'
                    } className={cn(
                        model.status === 'production' && 'bg-green-600/20 text-green-400 border-green-600/30',
                        model.status === 'staging' && 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                    )}>
                        {getStatusLabel(model.status)}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                 <div className="text-sm text-muted-foreground">
                    Criado em {model.createdAt.toLocaleDateString()}
                 </div>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between"><span>AUC:</span> <span className="font-mono">{model.metrics.auc.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>Brier:</span> <span className="font-mono">{model.metrics.brier.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>ECE:</span> <span className="font-mono">{model.metrics.ece.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>Winrate:</span> <span className="font-mono">{(model.metrics.winrateBacktest).toFixed(2)}%</span></div>
                 </div>
              </CardContent>
              <CardFooter>
                {model.status === "staging" && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleSetProduction(model.id)} 
                    disabled={loading[model.id]}
                  >
                    {loading[model.id] ? <Cpu className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Promover para Produção
                  </Button>
                )}
                 {model.status === "production" && (
                    <p className="text-xs text-muted-foreground w-full text-center">Atualmente ativo e executando trades.</p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
