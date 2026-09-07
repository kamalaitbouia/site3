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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 pb-safe shadow-lg">
      <div className="flex items-center justify-around">
        {/* Inventory tab */}
        <button
          onClick={() => onSelectTab('inventory')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            currentTab === 'inventory' ? 'text-teal-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {inStockCount > 0 && (
              <span className="absolute -top-1 -left-2 bg-teal-600 text-white rounded-full text-3xs font-bold w-4 h-4 flex items-center justify-center">
                {inStockCount}
              </span>
            )}
          </div>
          <span className="text-3xs mt-1">{t.mobileInventory}</span>
        </button>

        {/* Storage boxes tab */}
        <button
          onClick={() => onSelectTab('storage')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            currentTab === 'storage' ? 'text-teal-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Archive className="w-5 h-5" />
          <span className="text-3xs mt-1">{t.mobileStorage}</span>
        </button>

        {/* Center Prominent Add Button */}
        <button
          id="mobile-add-btn"
          onClick={onOpenAddModal}
          className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition"
          title={t.mobileAdd}
        >
          <Plus className="w-6 h-6 stroke-3" />
        </button>

        {/* Barcode Scanner Button */}
        <button
          id="mobile-scan-btn"
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-teal-600 font-medium transition"
        >
          <ScanLine className="w-5 h-5 text-teal-600" />
          <span className="text-3xs mt-1">{t.navScanner}</span>
        </button>

        {/* Analytics tab */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            currentTab === 'analytics' ? 'text-teal-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-3xs mt-1">{t.mobileAnalytics}</span>
        </button>
      </div>
    </div>
  );
};
