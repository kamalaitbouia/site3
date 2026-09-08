import React from 'react';
import { Archive, CheckCircle2, Tag, ArrowUpRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { STATUS_LABELS } from '../lib/constants';
import { useI18n } from '../lib/i18n';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onClick,
}) => {
  const { t, lang, getStatusName } = useI18n();

  const isSold = product.status === 'sold';
  const statusInfo = STATUS_LABELS[product.status] || STATUS_LABELS.in_storage;
  const potentialProfit = Math.max(0, product.targetPrice - product.purchasePrice);

  const displayImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=300';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onClick(product)}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98 ${
        isSold
          ? 'border-emerald-200/90 bg-emerald-50/15 hover:border-emerald-300'
          : product.status === 'listed'
          ? 'border-teal-200/90 hover:border-teal-400'
          : 'border-slate-200 hover:border-amber-300'
      }`}
    >
      {/* 1. SQUARE PHOTO CONTAINER WITH ESSENTIAL BADGES */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status Badge (in storage, listed, sold) on Top Corner */}
        <div className={`absolute top-2 ${lang === 'ar' ? 'right-2' : 'left-2'} z-10`}>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-black shadow-xs backdrop-blur-xs border ${
              product.status === 'in_storage'
                ? 'bg-amber-500 text-white border-amber-600'
                : product.status === 'listed'
                ? 'bg-teal-600 text-white border-teal-700'
                : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            {product.status === 'in_storage' && '📦 '}
            {product.status === 'listed' && '⚡ '}
            {product.status === 'sold' && '✓ '}
            {getStatusName(product.status)}
          </span>
        </div>

        {/* RAK / SHELF NUMBER OVERLAY BANNER (رقم الرف / الصندوق - واضح ومميز) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-transparent pt-4 pb-1.5 px-2 flex items-center justify-between text-white z-10">
          <div className="flex items-center gap-1 min-w-0">
            <Archive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-2xs font-black truncate text-amber-300">
              {product.storageLocation ? product.storageLocation : (lang === 'fr' ? 'Rayon ?' : 'رف غير محدد')}
            </span>
          </div>

          <span className="text-3xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
            <span>{lang === 'fr' ? 'Détails' : 'تفاصيل'}</span>
            <ArrowUpRight className="w-3 h-3 text-teal-400" />
          </span>
        </div>
      </div>

      {/* 2. COMPACT & CLEAN CARD BODY (Minimal text, zero clutter) */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1">
        {/* Brand & SKU Row (Never overlaps) */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-3xs font-bold text-teal-700 uppercase tracking-wider truncate">
            {product.brand || (lang === 'fr' ? 'Sans marque' : 'بدون ماركة')}
          </span>
          <span className="font-mono text-3xs font-black text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/80 shrink-0">
            {product.sku}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate group-hover:text-teal-700 transition-colors">
          {product.title}
        </h3>

        {/* Price & Profit Row */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-black text-slate-900">
              {isSold && product.saleDetails
                ? product.saleDetails.soldPrice.toFixed(1)
                : product.targetPrice.toFixed(1)} {currency.symbol}
            </span>
          </div>

          {/* Profit Pill */}
          <span
            className={`text-3xs font-bold px-1.5 py-0.5 rounded-md ${
              isSold
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-teal-50 text-teal-700 border border-teal-200/80'
            }`}
          >
            +{isSold && product.saleDetails
              ? product.saleDetails.netProfit.toFixed(0)
              : potentialProfit.toFixed(0)} {currency.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};
