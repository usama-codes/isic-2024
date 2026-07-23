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
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-hairline z-50 h-[72px] pb-safe flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] focus-ring transition-colors duration-120 ${
              isActive ? 'text-teal-dark' : 'text-ink-muted hover:bg-paper'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-teal' : 'text-ink-muted'}`} aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-wide uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
