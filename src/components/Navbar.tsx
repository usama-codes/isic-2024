"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Activity } from "lucide-react";

export default function Navbar() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-bg-base/60 backdrop-blur-xl border-b border-border-subtle">
      <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
        <Activity className="text-accent w-6 h-6" />
        <span>DermLens</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`transition-colors ${isActive('/') ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
            Analyze
          </Link>
          <Link href="/doctors" className={`transition-colors ${isActive('/doctors') ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
            Find Doctor
          </Link>
          <Link href="/education" className={`transition-colors ${isActive('/education') ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
            Education
          </Link>
          {user && (
            <Link href="/history" className={`transition-colors ${isActive('/history') ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
              History
            </Link>
          )}
        </div>

        <div className="h-4 w-px bg-border-medium hidden md:block"></div>

        {!loading && (
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to sign out?")) {
                      signOut();
                    }
                  }} 
                  className="text-text-secondary hover:text-danger transition-colors cursor-pointer" 
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/80 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
