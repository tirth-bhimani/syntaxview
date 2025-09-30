import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <SidebarTrigger />
            <Breadcrumb />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}