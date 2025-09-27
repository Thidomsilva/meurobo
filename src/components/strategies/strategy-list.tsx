import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreHorizontal, Play, Pause } from "lucide-react";
import { strategies } from "@/lib/data";
import { cn } from "@/lib/utils";

export function StrategyList() {
  const getStatusLabel = (active: boolean) => (active ? "Ativa" : "Pausada");
  const getModeLabel = (mode: "live" | "paper") => (mode === 'live' ? "Real" : "Demo");

  return (
    <>
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {strategies.map((strategy) => (
                <Card key={strategy.id} className="w-full">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <CardTitle>{strategy.name}</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Abrir menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    {strategy.active ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                    {strategy.active ? "Pausar" : "Ativar"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                    Excluir
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <CardDescription>{strategy.pairs.join(', ')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Badge
                                variant={strategy.active ? "default" : "secondary"}
                                className={cn(
                                    strategy.active ? "bg-green-600/20 text-green-400 border-green-600/30" : "",
                                    "hover:bg-transparent"
                                )}
                            >
                                {getStatusLabel(strategy.active)}
                            </Badge>
                             <Badge variant="outline">{getModeLabel(strategy.mode)}</Badge>
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                            Up: {strategy.thUp}, Down: {strategy.thDown}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Desktop View */}
        <Card className="hidden md:block">
        <CardHeader>
            <CardTitle>Suas Estratégias</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Modo</TableHead>
                <TableHead className="hidden lg:table-cell">Ativos</TableHead>
                <TableHead className="hidden lg:table-cell">Limites IA</TableHead>
                <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell>
                    <Badge
                        variant={strategy.active ? "default" : "secondary"}
                        className={cn(
                            strategy.active ? "bg-green-600/20 text-green-400 border-green-600/30" : "",
                            "hover:bg-transparent"
                        )}
                    >
                        {getStatusLabel(strategy.active)}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant="outline">{getModeLabel(strategy.mode)}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs">
                    {strategy.pairs.join(", ")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                    <div className="font-mono text-xs">
                        Up: {strategy.thUp}, Down: {strategy.thDown}, Edge: {strategy.minEdge}
                    </div>
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                            {strategy.active ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {strategy.active ? "Pausar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                            Excluir
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </>
  );
}
