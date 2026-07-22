import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AnalysisProvider } from "@/context/AnalysisContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DermLens — AI Skin Lesion Analysis",
  description: "Research-grade AI analysis for skin lesion images. Upload a dermoscopic image for instant melanoma probability estimation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative bg-bg-base text-text-primary">
        <AuthProvider>
          <AnalysisProvider>
            {/* Ambient background effects */}
            <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }}></div>
            <div className="fixed rounded-full blur-[120px] pointer-events-none z-0 w-[600px] h-[600px] -top-[200px] -right-[100px]" style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)" }}></div>
            <div className="fixed rounded-full blur-[120px] pointer-events-none z-0 w-[500px] h-[500px] -bottom-[150px] -left-[100px]" style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)" }}></div>

            <Navbar />
            
            <main className="relative z-10 max-w-[1120px] mx-auto px-6 py-12 md:py-24">
              {children}
            </main>
            
            <footer className="relative z-10 max-w-[1120px] mx-auto px-6 pb-16">
              <div className="flex gap-4 p-4 rounded-xl bg-warn-bg border border-warn-border text-warn text-sm items-start">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2"/><path d="M9 5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/></svg>
                <p>This model is intended for <strong className="text-[#fcd34d]">educational and research purposes only</strong>. It does not provide a medical diagnosis and should not replace evaluation by a qualified healthcare professional.</p>
              </div>
              <div className="flex justify-center gap-2 mt-10 text-xs text-text-tertiary">
                <span>Built with TensorFlow.js</span>
                <span className="opacity-40">·</span>
                <span>Model trained on ISIC 2024 dataset</span>
              </div>
            </footer>
          </AnalysisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
