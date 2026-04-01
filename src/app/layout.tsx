import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css"; 
import { createPageMetadata } from "@/utils/seo";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

// --- FONT CONFIGURATIONS ---

const firaCode = localFont({
  src: [
    { path: '../../public/assets/fonts/FiraCode-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/FiraCode-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-code',
  display: 'swap',
});

const outfit = localFont({
  src: [
    { path: '../../public/assets/fonts/Outfit-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/assets/fonts/Outfit-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/Outfit-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/assets/fonts/Outfit-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: [
    { path: '../../public/assets/fonts/SpaceGrotesk-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display', // Assuming you use this for big display headers
  display: 'swap',
});

const syne = localFont({
  src: [
    { path: '../../public/assets/fonts/Syne-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-syne',
  display: 'swap',
});

const jetBrainsMono = localFont({
  src: [
    { path: '../../public/assets/fonts/JetBrainsMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/assets/fonts/JetBrainsMono-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jetbrains',
  display: 'swap',
});

const inter = localFont({
  src: [
    { path: '../../public/assets/fonts/Inter_24pt-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Swayam Purwar - Creative Developer",
    description:
      "Swayam Purwar is a creative full-stack developer specialized in React, performance-first UI, and interactive web experiences.",
    path: "/",
  }),
  metadataBase: new URL("https://swayampurwar.com"),
  title: {
    default: "Swayam Purwar - Creative Developer",
    template: "%s | Swayam Purwar",
  },
  manifest: "/manifest.json",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,     // <-- ADD THIS: Prevents zooming in/out
  userScalable: false, // <-- ADD THIS: Disables pinch-to-zoom entirely
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={[
        firaCode.variable,
        outfit.variable,
        spaceGrotesk.variable,
        syne.variable,
        jetBrainsMono.variable,
        inter.variable
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
        {/* Synchronous script to prevent loader flash on reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('visited') === 'true') {
                  document.documentElement.classList.add('has-visited');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning> 
        <ClientLayoutWrapper>
          <Navbar />
          {children} 
          <Footer />
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}