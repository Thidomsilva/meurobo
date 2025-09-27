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
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    {strategy.active ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                    {strategy.active ? "Pause" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                    Delete
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
                                {strategy.active ? "Active" : "Paused"}
                            </Badge>
                             <Badge variant="outline">{strategy.mode}</Badge>
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
            <CardTitle>Your Strategies</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="hidden lg:table-cell">Pairs</TableHead>
                <TableHead className="hidden lg:table-cell">AI Thresholds</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        {strategy.active ? "Active" : "Paused"}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant="outline">{strategy.mode}</Badge>
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
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            {strategy.active ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {strategy.active ? "Pause" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                            Delete
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
