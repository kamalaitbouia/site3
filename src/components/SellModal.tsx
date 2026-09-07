import React, { useState } from 'react';
import { CheckCircle2, Package, TrendingUp, X } from 'lucide-react';
import { Product, Currency, SellingPlatform, SaleDetails } from '../types';
import { PLATFORMS } from '../lib/constants';
import { useI18n } from '../lib/i18n';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  currency: Currency;
  onConfirmSale: (productId: string, saleDetails: SaleDetails) => void;
}

export const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  product,
  currency,
  onConfirmSale,
}) => {
  const { t, lang } = useI18n();

  const [soldPrice, setSoldPrice] = useState<number | ''>(25);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState<SellingPlatform>('vinted');
  const [platformFees, setPlatformFees] = useState<number | ''>(0);
  const [shippingFees, setShippingFees] = useState<number | ''>(1.0); // typical packaging / tape / label cost
  const [buyerName, setBuyerName] = useState('');

  // Sync state when product opens or changes
  React.useEffect(() => {
    if (product) {
      setSoldPrice(product.targetPrice || 25);
      setSaleDate(new Date().toISOString().slice(0, 10));
      const defaultPlatform = product.targetPlatform || 'vinted';
      setPlatform(defaultPlatform);
      setPlatformFees(defaultPlatform === 'vinted' ? 0 : 0);
      setShippingFees(1.0);
      setBuyerName('');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const numSoldPrice = typeof soldPrice === 'number' ? soldPrice : parseFloat(soldPrice) || 0;
  const numPlatformFees = typeof platformFees === 'number' ? platformFees : parseFloat(platformFees) || 0;
  const numShippingFees = typeof shippingFees === 'number' ? shippingFees : parseFloat(shippingFees) || 0;
  const cost = product.purchasePrice || 0;

  // Real-time Net Profit:
  const netProfit = numSoldPrice - cost - numPlatformFees - numShippingFees;
  const roiPercentage = cost > 0 ? (netProfit / cost) * 100 : 0;
  const marginPercentage = numSoldPrice > 0 ? (netProfit / numSoldPrice) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numSoldPrice <= 0) return;

    onConfirmSale(product.id, {
      soldPrice: numSoldPrice,
      saleDate,
      platform,
      platformFees: numPlatformFees,
      shippingFees: numShippingFees,
      netProfit,
      roiPercentage,
      buyerName: buyerName.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-emerald-50/60">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t.successfulSaleTitle}
              </h2>
              <p className="text-xs text-emerald-800">
                {t.successfulSaleDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
              <Package className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-2xs font-bold px-1.5 py-0.5 bg-slate-800 text-white rounded">
                {product.sku}
              </span>
              <span className="text-2xs text-slate-500 font-medium">{product.brand}</span>
              <span className="text-2xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {product.storageLocation}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 truncate">{product.title}</h4>
            <span className="text-2xs text-slate-500">
              {t.origPurchaseCost}: <strong>{cost.toFixed(1)} {currency.symbol}</strong>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.finalSoldPrice} ({currency.symbol}) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                autoFocus
                value={soldPrice}
                onChange={(e) => setSoldPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-base text-emerald-700 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.saleDate} *
              </label>
              <input
                type="date"
                required
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.sellingPlatformLabel}
              </label>
              <select
                value={platform}
                onChange={(e) => {
                  const p = e.target.value as SellingPlatform;
                  setPlatform(p);
                  if (p === 'vinted') {
                    setPlatformFees(0); // Vinted seller fee is 0%
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden bg-white cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              {platform === 'vinted' && (
                <span className="text-3xs text-teal-600 block mt-1">
                  ✓ {t.vintedZeroSellerFees}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.buyerNameOptional}
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="@vinted_buyer"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Fees & Shipping deduction */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-2xs font-medium text-slate-600 mb-1">
                {t.platformCommission} ({currency.symbol})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={platformFees}
                onChange={(e) => setPlatformFees(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="0.0"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-2xs font-medium text-slate-600 mb-1">
                {t.packagingShippingCost} ({currency.symbol})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={shippingFees}
                onChange={(e) => setShippingFees(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="1.0"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
              />
            </div>
          </div>

          {/* Live Profit Calculation Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            netProfit >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {t.realNetProfitThisItem}
              </span>
              <span className={`text-xl font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(1)} {currency.symbol}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-2xs pt-2 border-t border-emerald-200/50">
              <div>
                <span className="opacity-80">{t.roiLabel}:</span>{' '}
                <strong className="text-xs">{roiPercentage.toFixed(0)}%</strong>
              </div>
              <div className={lang === 'fr' ? 'text-right' : 'text-left'}>
                <span className="opacity-80">{t.netMarginLabel}:</span>{' '}
                <strong className="text-xs">{marginPercentage.toFixed(0)}%</strong>
              </div>
            </div>

            <div className="text-3xs mt-2 opacity-75">
              {t.calculationFormula}: {numSoldPrice} - {cost} - {numPlatformFees} - {numShippingFees}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              id="confirm-sale-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {t.confirmSaleBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
