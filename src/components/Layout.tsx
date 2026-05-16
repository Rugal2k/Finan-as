/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ReceiptText, CalendarRange, PieChart, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center relative py-2 w-full transition-all duration-300",
      active ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600"
    )}
  >
    <Icon className={cn("w-6 h-6", active && "stroke-[2.5px]")} />
    <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Viewport for main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pb-safe pt-2 flex justify-around items-center h-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
        <NavItem
          icon={LayoutDashboard}
          label="Início"
          active={activeTab === 'dashboard'}
          onClick={() => onTabChange('dashboard')}
        />
        <NavItem
          icon={ReceiptText}
          label="Faturas"
          active={activeTab === 'invoices'}
          onClick={() => onTabChange('invoices')}
        />
        <NavItem
          icon={CalendarRange}
          label="Mensal"
          active={activeTab === 'monthly'}
          onClick={() => onTabChange('monthly')}
        />
        <NavItem
          icon={PieChart}
          label="Relatórios"
          active={activeTab === 'reports'}
          onClick={() => onTabChange('reports')}
        />
        <NavItem
          icon={Settings}
          label="Ajustes"
          active={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </nav>
    </div>
  );
};
