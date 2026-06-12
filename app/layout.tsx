import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SiteFooterWrapper } from "@/components/marketing/site-footer-wrapper";
import { SiteHeader } from "@/components/marketing/site-header";
import { SkipLink } from "@/components/marketing/skip-link";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  baseOpenGraphImages,
  createCanonicalUrl,
  seoKeywords,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} - shadcn/ui playground components`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: seoKeywords,
  authors: [{ name: "shadcn-sandbox" }],
  creator: "shadcn-sandbox",
  publisher: "shadcn-sandbox",
  category: "Developer Tools",
  alternates: {
    canonical: createCanonicalUrl(),
  },
  openGraph: {
    title: `${siteName} - shadcn/ui playground components`,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
    images: baseOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - shadcn/ui playground components`,
    description: siteDescription,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#252525",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    applicationCategory: "DeveloperApplication",
    programmingLanguage: ["TypeScript", "TSX", "CSS"],
    runtimePlatform: "Next.js",
    keywords: seoKeywords.join(", "),
  };

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <TooltipProvider>
            <SkipLink />
            <script
              type="application/ld+json"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Static JSON-LD generated from local constants for crawler metadata.
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
              }}
            />
            <SiteHeader />
            <main id="main-content" className="flex-1 scroll-mt-14">
              {children}
            </main>
            <SiteFooterWrapper />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
