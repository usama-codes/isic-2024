"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scan, BookOpen, Clock, Stethoscope, User } from 'lucide-react';

const navItems = [
  { label: 'Detect', href: '/', icon: Scan },
  { label: 'Learn', href: '/education', icon: BookOpen },
  { label: 'History', href: '/history', icon: Clock },
  { label: 'Find Care', href: '/doctors', icon: Stethoscope },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex flex-col fixed top-0 left-0 h-screen bg-surface border-r border-hairline z-50 w-[88px] lg:w-[88px] lg:hover:w-[240px] lg:focus-within:w-[240px] transition-[width] duration-220 overflow-hidden group">
      <div className="flex-1 flex flex-col py-8 w-[240px]">
        {/* Header/Logo */}
        <Link href="/" className="px-2 mx-4 mb-8 flex items-center h-12 focus-ring rounded-md">
          <div className="w-10 h-10 rounded-full border-2 border-teal flex items-center justify-center shrink-0 bg-paper">
            <Scan className="w-5 h-5 text-teal" aria-hidden="true" />
          </div>
          <span className="ml-4 font-display font-semibold text-xl text-ink whitespace-nowrap opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-220">
            Second Look
          </span>
        </Link>

        {/* Nav Items */}
        <ul className="flex flex-col gap-2 px-4 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors duration-120 focus-ring ${
                    isActive ? 'bg-teal/10 text-teal-dark' : 'text-ink-muted hover:bg-paper hover:text-ink'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-4 shrink-0">
                    <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-teal' : 'text-ink-muted'}`} aria-hidden="true" />
                    
                    {/* Tablet micro-label (visible on sm, hidden on lg when collapsed, or replaced by full label) */}
                    <span className={`text-[11px] font-semibold tracking-wide uppercase lg:hidden text-center`}>
                      {item.label}
                    </span>
                  </div>

                  {/* Desktop full label (hidden until hover) */}
                  <span className={`hidden lg:block whitespace-nowrap text-[15px] font-normal opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-220`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile Item (Bottom Pinned) */}
        <div className="px-4 mt-auto">
          <Link
            href="/profile"
            className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors duration-120 focus-ring ${
              pathname === '/profile' ? 'bg-teal/10 text-teal-dark' : 'text-ink-muted hover:bg-paper hover:text-ink'
            }`}
            aria-current={pathname === '/profile' ? 'page' : undefined}
          >
            <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-4 shrink-0">
              <User className={`w-6 h-6 shrink-0 ${pathname === '/profile' ? 'text-teal' : 'text-ink-muted'}`} aria-hidden="true" />
              <span className={`text-[11px] font-semibold tracking-wide uppercase lg:hidden text-center`}>
                Profile
              </span>
            </div>
            <span className={`hidden lg:block whitespace-nowrap text-[15px] font-normal opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-220`}>
              Profile
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
