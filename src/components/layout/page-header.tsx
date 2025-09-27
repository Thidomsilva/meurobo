"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6 sticky top-0 z-30">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {children}
      </div>
    </header>
  );
}
