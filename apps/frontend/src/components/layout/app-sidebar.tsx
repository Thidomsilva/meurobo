"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader as CSidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import {
  CandlestickChart,
  Bot,
  Settings,
  Presentation,
  History,
  LayoutDashboard,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/trade", label: "Operar", icon: CandlestickChart },
  { href: "/strategies", label: "Estratégias", icon: Presentation },
  { href: "/models", label: "Modelos IA", icon: Bot },
  { href: "/overlay", label: "Overlay Compacto", icon: Bot },
  { href: "/history", label: "Histórico", icon: History },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <CSidebarHeader>
        <Link href="/trade" className="flex items-center gap-2.5">
          <Icons.logo className="size-7 text-primary" />
          <span className="font-headline text-lg font-semibold tracking-tight">
            TradeAlchemistAI
          </span>
        </Link>
      </CSidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={{ children: link.label, side: "right", align: "center" }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {/* SidebarFooter removido conforme solicitado */}
    </Sidebar>
  );
}
