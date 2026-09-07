import React from 'react';
import { Archive, ArrowUpRight, DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { ResellerStats, Currency } from '../types';
import { useI18n } from '../lib/i18n';

interface StatsCardsProps {
  stats: ResellerStats;
  currency: Currency;
  onFilterStatus?: (status: string) => void;
  activeStatusFilter?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  currency,
  onFilterStatus,
  activeStatusFilter,
}) => {
  const { t, lang } = useI18n();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Realized Net Profit */}
      <div 
        onClick={() => onFilterStatus?.('sold')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
          activeStatusFilter === 'sold'
            ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-sm'
            : 'border-slate-200/80 hover:border-emerald-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">{t.statNetProfit}</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-emerald-600">
            {stats.totalNetProfit.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-600/80">
            {currency.symbol}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {stats.soldCount} {t.statItemsSold}
          </span>
          {stats.averageROI > 0 && (
            <span className="font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              {stats.averageROI.toFixed(0)}% ROI
            </span>
          )}
        </div>
      </div>

      {/* 2. Capital in Storage (Tied Cost) */}
      <div 
        onClick={() => onFilterStatus?.('in_storage')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
          activeStatusFilter === 'in_storage'
            ? 'border-amber-500 ring-2 ring-amber-100 shadow-sm'
            : 'border-slate-200/80 hover:border-amber-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">{t.statCapitalStorage}</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Archive className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-slate-800">
            {stats.totalInventoryCost.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            {currency.symbol}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">{t.statCapitalStorageDesc}</span>
          <span className="font-medium text-amber-700 whitespace-nowrap">
            {stats.inStorageCount} {t.statReadyInStorage}
          </span>
        </div>
      </div>

      {/* 3. Expected Revenue & Potential Profit */}
      <div 
        onClick={() => onFilterStatus?.('listed')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
          activeStatusFilter === 'listed'
            ? 'border-teal-500 ring-2 ring-teal-100 shadow-sm'
            : 'border-slate-200/80 hover:border-teal-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">{t.statPotentialProfit}</span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-teal-600">
            +{stats.totalPotentialProfit.toFixed(1)}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-teal-600/80">
            {currency.symbol}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {t.statPotentialRevenue}: {stats.totalExpectedRevenue.toFixed(0)} {currency.symbol}
          </span>
          <span className="font-medium text-teal-700">
            {stats.listedCount} {lang === 'fr' ? 'en vente' : 'معروضة'}
          </span>
        </div>
      </div>

      {/* 4. Active Stock Summary */}
      <div 
        onClick={() => onFilterStatus?.('all')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
          activeStatusFilter === 'all'
            ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-sm'
            : 'border-slate-200/80 hover:border-indigo-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">{t.statTotalItems}</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-800">
            {stats.inStorageCount + stats.listedCount}
          </span>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            {lang === 'fr' ? 'en stock invendu' : 'متبقية بالمخزن'}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-3 h-3 text-emerald-600" />
            {stats.soldCount} {lang === 'fr' ? 'vendus' : 'تم بيعها'}
          </span>
          <span className="text-slate-400">
            {lang === 'fr' ? 'Voir tout' : 'انقر لعرض الكل'}
          </span>
        </div>
      </div>
    </div>
  );
};
