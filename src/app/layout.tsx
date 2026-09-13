import type { Metadata } from "next";
import { Geist, Oswald } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { MotionProvider } from "@/components/shared/motion-provider";
import { SITE_CONFIG } from "@/lib/constants/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-3 focus:ring-ring/50"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <Toaster />
      </body>
    </html>
  );
}
