import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "@/components/BootstrapClient";
import PWARegistration from "@/components/PWARegistration";
import AsyncIconLink from "@/components/AsyncIconLink";
import { AuthProvider } from "@/context/AuthContext";
import { preload } from "react-dom";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "LoadFlow | Enterprise Logistics & Fleet Management",
    template: "%s | LoadFlow"
  },
  description: "LoadFlow is an enterprise-grade freight management platform. Streamline your dispatching, track multi-stop logistics, and manage your fleet with real-time audit logs.",
  keywords: ["Logistics", "Freight Management", "Fleet Tracking", "Multi-stop Dispatch", "Supply Chain SaaS", "Trucking Software"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LoadFlow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preload the LCP image to ensure it's discovered in the document head immediately
  preload("/truck-trailer.png", { as: "image", fetchPriority: "high" });

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/* Non-blocking CSS for Icons */}
        <AsyncIconLink />
        <noscript>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        </noscript>
      </head>
      <body className={`${jakarta.variable} ${outfit.variable} bg-light text-dark`} suppressHydrationWarning>
        <AuthProvider>
          <BootstrapClient />
          <PWARegistration />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
