import React from 'react';
import { 
  Award, 
  Calendar, 
  Layers, 
  TrendingUp 
} from 'lucide-react';
import { Product, Currency, ResellerStats } from '../types';
import { CATEGORIES } from '../lib/constants';
import { useI18n } from '../lib/i18n';

interface ProfitAnalyticsProps {
  products: Product[];
  stats: ResellerStats;
  currency: Currency;
  onViewProduct?: (product: Product) => void;
}

export const ProfitAnalytics: React.FC<ProfitAnalyticsProps> = ({
  products,
  stats,
  currency,
}) => {
  const { t, lang, getCategoryName } = useI18n();

  const soldProducts = products.filter((p) => p.status === 'sold' && p.saleDetails);

  // Group profit by Brand
  const brandProfitMap: Record<string, { count: number; profit: number; revenue: number; cost: number }> = {};
  soldProducts.forEach((p) => {
    const brand = p.brand?.trim() || t.otherBrand;
    if (!brandProfitMap[brand]) {
      brandProfitMap[brand] = { count: 0, profit: 0, revenue: 0, cost: 0 };
    }
    brandProfitMap[brand].count++;
    brandProfitMap[brand].profit += p.saleDetails?.netProfit || 0;
    brandProfitMap[brand].revenue += p.saleDetails?.soldPrice || 0;
    brandProfitMap[brand].cost += p.purchasePrice || 0;
  });

  const topBrands = Object.entries(brandProfitMap)
    .sort((a, b) => b[1].profit - a[1].profit)
    .slice(0, 5);

  // Group profit by Category
  const categoryProfitMap: Record<string, { count: number; profit: number }> = {};
  soldProducts.forEach((p) => {
    const cat = p.category || 'other';
    if (!categoryProfitMap[cat]) {
      categoryProfitMap[cat] = { count: 0, profit: 0 };
    }
    categoryProfitMap[cat].count++;
    categoryProfitMap[cat].profit += p.saleDetails?.netProfit || 0;
  });

  const topCategories = Object.entries(categoryProfitMap)
    .sort((a, b) => b[1].profit - a[1].profit)
    .map(([catId, data]) => {
      return {
        id: catId,
        label: getCategoryName(catId),
        ...data,
      };
    });

  // Calculate gross margin %
  const grossMargin = stats.totalSoldRevenue > 0
    ? ((stats.totalNetProfit / stats.totalSoldRevenue) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Overview */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-semibold text-emerald-300 tracking-wider flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4" />
                {t.financialPerformanceTitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {t.totalNetProfitsBanner}: {stats.totalNetProfit.toFixed(1)} {currency.symbol}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-medium">
                {stats.soldCount} {t.successfulSalesBadge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div>
              <span className="text-xs text-slate-300 block mb-1">{t.revenueTotal}</span>
              <span className="text-lg sm:text-xl font-bold text-white">
                {stats.totalSoldRevenue.toFixed(1)} {currency.symbol}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-300 block mb-1">{t.cogsTotal}</span>
              <span className="text-lg sm:text-xl font-bold text-slate-200">
                {stats.totalSoldCost.toFixed(1)} {currency.symbol}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-300 block mb-1">{t.avgProfitPerItem}</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">
                +{stats.averageProfitPerItem.toFixed(1)} {currency.symbol}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-300 block mb-1">{t.grossMargin}</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-300">
                {grossMargin}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Top Profitable Brands & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Profitable Brands */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{t.topBrandsTitle}</h3>
            </div>
            <span className="text-2xs text-slate-500">{t.byNetProfit}</span>
          </div>

          {topBrands.length > 0 ? (
            <div className="space-y-3">
              {topBrands.map(([brand, data], idx) => {
                const percentOfTotal = stats.totalNetProfit > 0
                  ? Math.min(100, (data.profit / stats.totalNetProfit) * 100)
                  : 0;
                return (
                  <div key={brand} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-2xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <strong className="text-slate-800">{brand}</strong>
                        <span className="text-slate-400 text-2xs">({data.count} {t.itemsCount})</span>
                      </div>
                      <span className="font-bold text-emerald-700">
                        +{data.profit.toFixed(1)} {currency.symbol}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.max(5, percentOfTotal)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              {t.notEnoughSalesBrands}
            </p>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{t.topCategoriesTitle}</h3>
            </div>
            <span className="text-2xs text-slate-500">{t.bySales}</span>
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-3">
              {topCategories.map((cat, idx) => {
                const percentOfTotal = stats.totalNetProfit > 0
                  ? Math.min(100, (cat.profit / stats.totalNetProfit) * 100)
                  : 0;
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-2xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <strong className="text-slate-800">{cat.label}</strong>
                        <span className="text-slate-400 text-2xs">({cat.count} {t.salesCount})</span>
                      </div>
                      <span className="font-bold text-teal-700">
                        +{cat.profit.toFixed(1)} {currency.symbol}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.max(5, percentOfTotal)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              {t.noSalesInCategories}
            </p>
          )}
        </div>
      </div>

      {/* Sales History Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">{t.salesHistoryTitle}</h3>
          </div>
          <span className="text-xs text-slate-500">{soldProducts.length} {t.completedSales}</span>
        </div>

        {soldProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className={`w-full ${lang === 'fr' ? 'text-left' : 'text-right'} text-xs`}>
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">{t.tableProductSku}</th>
                  <th className="py-3 px-4">{t.tableSaleDate}</th>
                  <th className="py-3 px-4">{t.tablePlatform}</th>
                  <th className="py-3 px-4">{t.tableCostPrice}</th>
                  <th className="py-3 px-4">{t.tableSoldPrice}</th>
                  <th className="py-3 px-4">{t.tableFeesShipping}</th>
                  <th className="py-3 px-4">{t.tableNetProfit}</th>
                  <th className="py-3 px-4">{t.tableRoi}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {soldProducts.map((p) => {
                  const sale = p.saleDetails!;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover border" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center font-mono text-3xs">
                              {p.sku}
                            </div>
                          )}
                          <div>
                            <span className="font-mono text-2xs text-teal-700 font-bold block">{p.sku}</span>
                            <span className="font-bold text-slate-800 line-clamp-1">{p.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {sale.saleDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                          {sale.platform.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.purchasePrice.toFixed(1)} {currency.symbol}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {sale.soldPrice.toFixed(1)} {currency.symbol}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {(sale.platformFees + sale.shippingFees).toFixed(1)} {currency.symbol}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          +{sale.netProfit.toFixed(1)} {currency.symbol}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">
                        {sale.roiPercentage.toFixed(0)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            {t.noSalesRecordedYet}
          </div>
        )}
      </div>
    </div>
  );
};
