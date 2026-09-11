import React from 'react';
import { Archive, BarChart3, Package, Plus, ScanLine } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface MobileBottomNavProps {
  currentTab: 'inventory' | 'storage' | 'analytics';
  onSelectTab: (tab: 'inventory' | 'storage' | 'analytics') => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  inStockCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onOpenScanner,
  inStockCount,
}) => {
  const { t } = useI18n();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 pb-safe shadow-lg overflow-visible">
      <div className="flex items-center justify-around overflow-visible">
        {/* Inventory tab */}
        <button
          onClick={() => onSelectTab('inventory')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentTab === 'inventory' ? 'text-teal-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {inStockCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-teal-600 text-white rounded-full text-3xs font-bold w-3.5 h-3.5 flex items-center justify-center">
                {inStockCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5">{t.mobileInventory}</span>
        </button>

        {/* Storage boxes tab */}
        <button
          onClick={() => onSelectTab('storage')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentTab === 'storage' ? 'text-teal-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Archive className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">{t.mobileStorage}</span>
        </button>

        {/* Center Prominent Add Button - smaller now */}
        <div className="relative -top-3 flex flex-col items-center shrink-0">
          <button
            id="mobile-add-btn"
            onClick={onOpenAddModal}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/40 ring-4 ring-white active:scale-95 transition cursor-pointer"
            title={t.mobileAdd}
          >
            <Plus className="w-5 h-5 stroke-3" />
          </button>
          <span className="text-[9px] font-bold text-teal-700 mt-0.5 hidden sm:block">
            {t.mobileAdd}
          </span>
        </div>

        {/* Barcode Scanner Button */}
        <button
          id="mobile-scan-btn"
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-teal-600 font-medium transition"
        >
          <ScanLine className="w-5 h-5 text-teal-600" />
          <span className="text-[9px] mt-0.5">{t.navScanner}</span>
        </button>

        {/* Analytics tab */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentTab === 'analytics' ? 'text-teal-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">{t.mobileAnalytics}</span>
        </button>
      </div>
    </div>
  );
};
