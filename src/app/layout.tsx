// External Dependencies
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";

// Internal Dependencies
import "@/styles/globals.css";
import { Providers } from "@/components/ui/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "Notes from Video",
  description: "Take notes from YouTube videos with AI assistance",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
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
      </body>
    </html>
  );
}
