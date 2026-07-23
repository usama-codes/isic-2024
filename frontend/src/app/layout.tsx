import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AnalysisProvider } from "@/context/AnalysisContext";
import AppShell from "@/components/AppShell";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Second Look",
  description: "A second look before you decide whether to see a doctor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#FAF8F4" />
      </head>
      <body className="antialiased min-h-screen bg-paper text-ink">
        <a href="#main-content" className="skip-link focus-ring">
          Skip to main content
        </a>

        <AuthProvider>
          <AnalysisProvider>
            <AppShell>
              <main id="main-content" className="w-full">
                {children}
              </main>
            </AppShell>
          </AnalysisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
