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
  name: z.string().min(3, "Name must be at least 3 characters."),
  pairs: z.string().min(3, "Enter at least one pair (e.g., EURUSD)."),
  active: z.boolean().default(true),
  mode: z.enum(["live", "paper"]).default("paper"),
  timeframeSec: z.enum(["60", "300", "900"]).default("60"),
  expirationSec: z.enum(["60", "120", "300"]).default("60"),
  stakeType: z.enum(["fixed", "percent"]).default("fixed"),
  stakeValue: z.coerce.number().min(1, "Stake must be positive."),
  gales: z.coerce.number().min(0).max(5).default(0),
  galeMultiplier: z.coerce.number().min(1).default(2.1),
  stopLossValue: z.coerce.number().min(0).default(0),
  stopWinValue: z.coerce.number().min(0).default(0),
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
      title: "Strategy Created",
      description: `The strategy "${data.name}" has been successfully created.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Strategy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Strategy</DialogTitle>
          <DialogDescription>
            Configure the parameters for your new automated trading strategy.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4 py-4">
                {/* General Fields */}
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Strategy Name</FormLabel><FormControl><Input placeholder="e.g., EURUSD Scalper" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="pairs" render={({ field }) => ( <FormItem><FormLabel>Trading Pairs</FormLabel><FormControl><Textarea placeholder="Comma-separated, e.g., EURUSD,GBPJPY" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="timeframeSec" render={({ field }) => ( <FormItem><FormLabel>Timeframe</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select timeframe" /></SelectTrigger></FormControl><SelectContent><SelectItem value="60">1 Minute</SelectItem><SelectItem value="300">5 Minutes</SelectItem><SelectItem value="900">15 Minutes</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="expirationSec" render={({ field }) => ( <FormItem><FormLabel>Expiration</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select expiration" /></SelectTrigger></FormControl><SelectContent><SelectItem value="60">1 Minute</SelectItem><SelectItem value="120">2 Minutes</SelectItem><SelectItem value="300">5 Minutes</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="mode" render={({ field }) => ( <FormItem><FormLabel>Mode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger></FormControl><SelectContent><SelectItem value="live">Live Account</SelectItem><SelectItem value="paper">Paper Account</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="active" render={({ field }) => ( <FormItem className="flex flex-col pt-2"><FormLabel>Active</FormLabel><div className="flex items-center space-x-2 pt-2.5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label htmlFor="active-switch">{field.value ? "On" : "Off"}</Label></div></FormItem> )} />
                </div>
              </TabsContent>
              <TabsContent value="risk" className="space-y-4 py-4">
                {/* Risk Management Fields */}
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="stakeType" render={({ field }) => ( <FormItem><FormLabel>Stake Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select stake type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="fixed">Fixed Amount ($)</SelectItem><SelectItem value="percent">Percentage (%)</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="stakeValue" render={({ field }) => ( <FormItem><FormLabel>Stake Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="gales" render={({ field }) => ( <FormItem><FormLabel>Martingale Gales</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="galeMultiplier" render={({ field }) => ( <FormItem><FormLabel>Gale Multiplier</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="stopLossValue" render={({ field }) => ( <FormItem><FormLabel>Stop Loss ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="stopWinValue" render={({ field }) => ( <FormItem><FormLabel>Stop Win ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
              </TabsContent>
              <TabsContent value="ai" className="space-y-6 py-4">
                {/* AI Parameters */}
                 <FormField control={form.control} name="thUp" render={({ field }) => ( <FormItem><div className="flex justify-between"><FormLabel>Up Threshold (CALL)</FormLabel><span className="text-sm text-muted-foreground font-mono">{field.value.toFixed(2)}</span></div><FormControl><Slider defaultValue={[field.value]} min={0.5} max={1} step={0.01} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormDescription>Min. AI probability to enter a CALL trade.</FormDescription></FormItem> )} />
                 <FormField control={form.control} name="thDown" render={({ field }) => ( <FormItem><div className="flex justify-between"><FormLabel>Down Threshold (PUT)</FormLabel><span className="text-sm text-muted-foreground font-mono">{field.value.toFixed(2)}</span></div><FormControl><Slider defaultValue={[field.value]} min={0.5} max={1} step={0.01} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormDescription>Min. AI probability to enter a PUT trade.</FormDescription></FormItem> )} />
                 <FormField control={form.control} name="minEdge" render={({ field }) => ( <FormItem><div className="flex justify-between"><FormLabel>Minimum Edge</FormLabel><span className="text-sm text-muted-foreground font-mono">{field.value.toFixed(2)}</span></div><FormControl><Slider defaultValue={[field.value]} min={0.01} max={0.5} step={0.01} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormDescription>Min. advantage over 50% required.</FormDescription></FormItem> )} />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit">Save Strategy</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
