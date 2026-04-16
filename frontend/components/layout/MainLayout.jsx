'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

const MainLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!isAuthPage && (!user || !user.token)) {
      router.push('/login');
    } else if (isAuthPage && user && user.token) {
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router, pathname, isAuthPage]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-primary rounded-full animate-spin shadow-neo-sm"></div>
        <p className="font-black uppercase text-xs tracking-widest animate-pulse">Initializing Analyst Node...</p>
      </div>
    );
  }

  // Render children without Sidebar/Navbar for Auth pages
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-light font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Sidebar - Persistent on Desktop, Drawer on Mobile */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-3 md:p-5 overflow-x-hidden">
          {children}
        </main>

        <footer className="p-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Sentiqo AI © 2026 — Sentiment Analysis Platform - Atharva Lotankar
        </footer>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
