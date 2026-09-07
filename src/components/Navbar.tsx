import React from 'react';
import { 
  Archive, 
  BarChart3, 
  Download, 
  Package, 
  Plus,
  ScanLine 
} from 'lucide-react';
import { Currency } from '../types';
import { CURRENCIES } from '../lib/constants';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '../lib/i18n';

interface NavbarProps {
  currentTab: 'inventory' | 'storage' | 'analytics';
  onSelectTab: (tab: 'inventory' | 'storage' | 'analytics') => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenScanner: () => void;
  currentCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  inStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onOpenBackupModal,
  onOpenScanner,
  currentCurrency,
  onSelectCurrency,
  inStockCount,
}) => {
  const { t, lang } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo & App Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <Archive className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {t.appName}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-3xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {t.appBadge}
                </span>
              </div>
              <p className="text-2xs text-slate-500 hidden lg:block">
                {t.appDescription}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => onSelectTab('inventory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === 'inventory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.navInventory}</span>
              <span className="text-2xs font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                {inStockCount}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('storage')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === 'storage'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{t.navStorage}</span>
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.navAnalytics}</span>
            </button>
          </nav>

          {/* Right Controls: Language Switcher, Currency, Install PWA, Backup, Add Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currentCurrency.code}
                onChange={(e) => {
                  const found = CURRENCIES.find((c) => c.code === e.target.value);
                  if (found) onSelectCurrency(found);
                }}
                className="text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-1.5 px-2.5 rounded-xl border border-slate-200/80 focus:outline-hidden cursor-pointer"
                title={t.currencyLabel}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {lang === 'fr' ? c.code : c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton variant="header" />

            {/* Scanner CTA Button */}
            <button
              id="top-scanner-btn"
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200/90 shadow-2xs hover:shadow-xs transition shrink-0 cursor-pointer"
              title={t.scannerModalTitle}
            >
              <ScanLine className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">{t.navScanner}</span>
            </button>

            {/* Backup & Settings button */}
            <button
              onClick={onOpenBackupModal}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title={t.navBackup}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Primary Add Product CTA */}
            <button
              id="top-add-product-btn"
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow transition shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.navAddProduct}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
