// src/components/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AccountType } from "@/lib/utils";


interface DashboardLayoutProps {
  accountType: AccountType
}

export function DashboardLayout({ accountType }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar accountType={accountType}/>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-bold text-foreground">TaskLink Dashboard</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {/* This is where nested routes render */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
