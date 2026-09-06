import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MusicProvider } from "@/components/music/MusicProvider";
import { ParticlesBackground } from "@/components/ui/ParticlesBackground";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const displayFont = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0813",
};

export const metadata: Metadata = {
  title: "Happy Birthday Mau! ❤️ ✨",
  description: "A private digital birthday universe created with love for Mau.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${displayFont.variable} dark`}
    >
      <body className="font-sans antialiased bg-mau-dark text-mau-cream selection:bg-mau-rose/30 selection:text-mau-cream min-h-screen relative">
        <ClerkProvider>
          <MusicProvider>
            <ParticlesBackground />
            <main className="relative z-10">{children}</main>
          </MusicProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
