import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  User,
  Plus,
  Coins,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'transactions' | 'reports' | 'profile';

interface AndroidDeviceFrameProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  children: React.ReactNode;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0B0F19] flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
      {/* Physical Mobile Screen Device */}
      <div className="relative w-[375px] max-w-[100vw] h-[670px] max-h-[94vh] rounded-[42px] bg-[#0F172A] p-[9px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col transition-all">
        {/* Outer Phone Bezel Trim with subtle metallic highlight */}
        <div className="relative w-full h-full rounded-[33px] bg-[#FAF8F5] overflow-hidden flex flex-col shadow-inner border border-slate-300/60">

          {/* Material & Skeuomorphic App Bar (Clean top without status bar) */}
          <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.03)] shrink-0 z-20">
            <div className="flex items-center gap-2">
              {/* Embossed Coin brand glyph */}
              <div className="w-7 h-7 rounded-full skeuo-coin-badge flex items-center justify-center text-amber-950 font-black text-xs shadow-sm">
                <Coins className="w-4 h-4 text-amber-950" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 tracking-tight leading-none block font-mono">
                  PENNYWISE
                </span>
                <span className="text-[9px] text-teal-800 font-semibold tracking-wide uppercase leading-tight">
                  Expense Ledger
                </span>
              </div>
            </div>

            {activeTab !== 'profile' && (
              <button
                onClick={onOpenAddModal}
                className="px-2.5 py-1 text-white rounded-lg text-xs font-bold skeuo-btn-teal flex items-center gap-1 cursor-pointer"
                title="Add new transaction"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>

          {/* Scrollable Mobile Viewport */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 relative skeuo-paper">
            {children}
          </div>

          {/* Floating Action Button (FAB) inside mobile screen */}
          {activeTab !== 'profile' && (
            <button
              onClick={onOpenAddModal}
              className="absolute bottom-[66px] right-4 z-40 w-11 h-11 rounded-full skeuo-btn-teal text-white flex items-center justify-center shadow-lg transition-all cursor-pointer border-2 border-white/70"
              aria-label="Add transaction"
              title="Add Transaction"
            >
              <Plus className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          )}

          {/* Material Design Bottom Navigation Bar with Profile Tab */}
          <nav className="shrink-0 bg-white border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-[0_-2px_8px_rgba(0,0,0,0.04)] z-30">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-teal-700 font-bold bg-teal-50/70 shadow-inner'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[9px]">Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('transactions')}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'text-teal-700 font-bold bg-teal-50/70 shadow-inner'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span className="text-[9px]">Ledger</span>
            </button>

            <button
              onClick={() => onTabChange('reports')}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'text-teal-700 font-bold bg-teal-50/70 shadow-inner'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[9px]">Reports</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-teal-700 font-bold bg-teal-50/70 shadow-inner'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px]">Profile</span>
            </button>
          </nav>

          {/* Android Gesture Navigation Pill */}
          <div className="bg-white py-1 flex justify-center shrink-0">
            <div className="w-24 h-1 bg-slate-300 rounded-full shadow-inner" />
          </div>

        </div>
      </div>
    </div>
  );
};
