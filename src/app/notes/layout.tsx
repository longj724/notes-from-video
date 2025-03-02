// External Dependencies
import { Toaster } from "sonner";

// Internal Dependencies
import "@/styles/globals.css";
import { Providers } from "@/components/ui/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Providers>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
        <Toaster />
      </Providers>
    </ThemeProvider>
  );
}
