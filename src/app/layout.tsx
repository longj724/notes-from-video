// External Dependencies
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

// Internal Dependencies
import "@/styles/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
