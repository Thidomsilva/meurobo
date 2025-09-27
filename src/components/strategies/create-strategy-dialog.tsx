"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const strategySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  pairs: z.string().min(3, "Insira pelo menos um par (ex: EURUSD)."),
  active: z.boolean().default(true),
  mode: z.enum(["live", "paper"]).default("paper"),
  timeframeSec: z.enum(["60", "300", "900"]).default("60"),
  expirationSec: z.enum(["60", "120", "300"]).default("60"),
  stakeType: z.enum(["fixed", "percent"]).default("fixed"),
  stakeValue: z.coerce.number().min(1, "O valor da entrada deve ser positivo."),
  gales: z.coerce.number().min(0, "O número de gales não pode ser negativo.").max(5, "Máximo de 5 gales.").default(0),
  galeMultiplier: z.coerce.number().min(1, "O multiplicador deve ser no mínimo 1.").default(2.1),
  stopLossValue: z.coerce.number().min(0, "O Stop Loss não pode ser negativo.").default(0),
  stopWinValue: z.coerce.number().min(0, "O Stop Win não pode ser negativo.").default(0),
  thUp: z.number().min(0.5).max(1.0).default(0.65),
  thDown: z.number().min(0.5).max(1.0).default(0.65),
  minEdge: z.number().min(0.01).max(0.5).default(0.15),
});

type StrategyFormValues = z.infer<typeof strategySchema>;

export function CreateStrategyDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      name: "",
      pairs: "",
      active: true,
      mode: "paper",
      timeframeSec: "60",
      expirationSec: "60",
      stakeType: "fixed",
      stakeValue: 10,
      gales: 0,
      galeMultiplier: 2.1,
      stopLossValue: 500,
      stopWinValue: 1000,
      thUp: 0.65,
      thDown: 0.65,
      minEdge: 0.15,
    },
  });

  function onSubmit(data: StrategyFormValues) {
    console.log(data);
    toast({
      title: "Estratégia Criada",
      description: `A estratégia "${data.name}" foi criada com sucesso.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar Estratégia</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Estratégia</DialogTitle>
          <DialogDescription>
            Configure os parâmetros para sua nova estratégia de trading automatizado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="geral">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="risco">Gerenciamento</TabsTrigger>
                <TabsTrigger value="ai">Parâmetros IA</TabsTrigger>
              </TabsList>
              <TabsContent value="geral" className="space-y-4 py-4">
                {/* General Fields */}
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Nome da Estratégia</FormLabel><FormControl><Input placeholder="ex: Scalper EURUSD M1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="pairs" render={({ field }) => ( <FormItem><FormLabel>Ativos</FormLabel><FormControl><Textarea placeholder="Separados por vírgula, ex: EURUSD,GBPJPY" {...field} /></FormControl><FormDescription>Liste os pares de moedas para operar.</FormDescription><FormMessage /></FormItem> )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="timeframeSec" render={({ field }) => ( <FormItem><FormLabel>Timeframe</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o timeframe" /></SelectTrigger></FormControl><SelectContent><SelectItem value="60">1 Minuto</SelectItem><SelectItem value="300">5 Minutos</SelectItem><SelectItem value="900">15 Minutos</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="expirationSec" render={({ field }) => ( <FormItem><FormLabel>Expiração</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione a expiração" /></SelectTrigger></FormControl><SelectContent><SelectItem value="60">1 Minuto</SelectItem><SelectItem value="120">2 Minutos</SelectItem><SelectItem value="300">5 Minutos</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="mode" render={({ field }) => ( <FormItem><FormLabel>Modo de Operação</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o modo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="live">Conta Real</SelectItem><SelectItem value="paper">Conta Demo</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="active" render={({ field }) => ( <FormItem className="flex flex-col pt-2"><FormLabel>Ativada</FormLabel><div className="flex items-center space-x-2 pt-2.5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label htmlFor="active-switch">{field.value ? "Sim" : "Não"}</Label></div></FormItem> )} />
                </div>
              </TabsContent>
              <TabsContent value="risco" className="space-y-4 py-4">
                {/* Risk Management Fields */}
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="stakeType" render={({ field }) => ( <FormItem><FormLabel>Tipo de Entrada</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="fixed">Valor Fixo ($)</SelectItem><SelectItem value="percent">Porcentagem (%)</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="stakeValue" render={({ field }) => ( <FormItem><FormLabel>Valor da Entrada</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <div className="border p-4 rounded-md space-y-4">
                    <h4 className="font-medium text-sm">Martingale</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="gales" render={({ field }) => ( <FormItem><FormLabel>Nº de Gales</FormLabel><FormControl><Input type="number" min="0" max="5" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="galeMultiplier" render={({ field }) => ( <FormItem><FormLabel>Multiplicador</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                </div>
                 <div className="border p-4 rounded-md space-y-4">
                     <h4 className="font-medium text-sm">Gerenciamento de Banca</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="stopWinValue" render={({ field }) => ( <FormItem><FormLabel>Stop Win (Meta)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="stopLossValue" render={({ field }) => ( <FormItem><FormLabel>Stop Loss (Perda)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="ai" className="space-y-6 py-4">
                {/* AI Parameters */}
                 <FormField control={form.control} name="thUp" render={({ field }) => ( <FormItem><div className="flex justify-between"><FormLabel>Confiança Mínima (CALL)</FormLabel><span className="text-sm text-muted-foreground font-mono">{field.value.toFixed(2)}</span></div><FormControl><Slider defaultValue={[field.value]} min={0.5} max={1} step={0.01} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormDescription>Probabilidade mínima da IA para entrar em uma operação de compra.</FormDescription></FormItem> )} />
                 <FormField control={form.control} name="thDown" render={({ field }) => ( <FormItem><div className="flex justify-between"><FormLabel>Confiança Mínima (PUT)</FormLabel><span className="text-sm text-muted-foreground font-mono">{field.value.toFixed(2)}</span></div><FormControl><Slider defaultValue={[field.value]} min={0.5} max={1} step={0.01} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormDescription>Probabilidade mínima da IA para entrar em uma operação de venda.</FormDescription></FormItem> )} />
                 <FormField control={form.control} name="minEdge" render={({ field }) => ( <FormItem><div className="flex justify-between"><FormLabel>Vantagem Mínima</FormLabel><span className="text-sm text-muted-foreground font-mono">{field.value.toFixed(2)}</span></div><FormControl><Slider defaultValue={[field.value]} min={0.01} max={0.5} step={0.01} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormDescription>Vantagem mínima da probabilidade sobre 50% para a IA considerar a entrada.</FormDescription></FormItem> )} />
              </TabsContent>
            </Tabs>
            <DialogFooter>
               <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar Estratégia</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
