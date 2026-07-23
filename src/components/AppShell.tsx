import React from 'react';
import SidebarNav from './SidebarNav';
import BottomTabBar from './BottomTabBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      
      {/* 
        Main content area needs to account for the fixed nav bars.
        Desktop/Tablet: margin-left for the 88px sidebar. 
        Mobile: margin-bottom for the 72px bottom bar, no margin-left. 
      */}
      <div className="flex-1 sm:ml-[88px] mb-[72px] sm:mb-0 transition-all duration-220">
        <div className="max-w-[1120px] mx-auto px-6 sm:px-10 lg:px-16 py-8 md:py-12">
          {children}
        </div>
      </div>
      
      <BottomTabBar />
    </div>
  );
}
