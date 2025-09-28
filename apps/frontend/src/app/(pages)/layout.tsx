
'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { BrokerProvider } from '@/contexts/broker-context';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Desabilitado temporariamente - pular verificação de autenticação
    setIsAuthenticated(true);
    
    // const authStatus = localStorage.getItem('isAuthenticated');
    // if (authStatus !== 'true') {
    //   router.push('/login');
    // } else {
    //   setIsAuthenticated(true);
    // }
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return (
        <div className="flex h-screen w-full">
            <div className="hidden md:block">
                <Skeleton className="h-full w-[16rem]" />
            </div>
            <div className="flex-1 p-4">
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <BrokerProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen overflow-hidden">
            {children}
          </div>
        </SidebarInset>
      </BrokerProvider>
    </SidebarProvider>
  );
}
