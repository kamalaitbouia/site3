import React from 'react';
import { 
  Archive, 
  CheckCircle2, 
  Copy, 
  DollarSign, 
  Edit3, 
  Printer, 
  Sparkles, 
  Tag, 
  Trash2 
} from 'lucide-react';
import { Product, Currency } from '../types';
import { CONDITIONS, PLATFORMS, STATUS_LABELS } from '../lib/constants';
import { useI18n } from '../lib/i18n';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (id: string) => void;
  onMarkAsSold: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onPrintLabel: (product: Product) => void;
  onGenerateListing: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onEdit,
  onDuplicate,
  onDelete,
  onMarkAsSold,
  onToggleStatus,
  onPrintLabel,
  onGenerateListing,
}) => {
  const { t, lang, getConditionName, getStatusName } = useI18n();

  const statusInfo = STATUS_LABELS[product.status] || STATUS_LABELS.in_storage;
  const conditionInfo = CONDITIONS.find((c) => c.id === product.condition);
  const platformInfo = PLATFORMS.find((p) => p.id === product.targetPlatform) || PLATFORMS[0];

  const potentialProfit = Math.max(0, product.targetPrice - product.purchasePrice);
  const isSold = product.status === 'sold';

  return (
    <div 
      id={`product-card-${product.id}`}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSold
          ? 'border-emerald-200/80 bg-emerald-50/10 hover:border-emerald-300'
          : 'border-slate-200 hover:border-teal-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner / Image Section */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
            <Tag className="w-12 h-12 stroke-1 mb-1" />
            <span className="text-xs text-slate-400">{t.cardNoImage}</span>
          </div>
        )}

        {/* Status Pill on Top Corner */}
        <div className={`absolute top-2.5 ${lang === 'ar' ? 'right-2.5 items-end' : 'left-2.5 items-start'} flex flex-col gap-1.5`}>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs border ${statusInfo.bg} ${statusInfo.color}`}>
            {getStatusName(product.status)}
          </span>
          {isSold && product.saleDetails && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-600 text-white shadow-xs">
              +{product.saleDetails.netProfit.toFixed(1)} {currency.symbol} {t.cardNetProfit}
            </span>
          )}
        </div>

        {/* SKU & Storage Box on opposite Top Corner */}
        <div className={`absolute top-2.5 ${lang === 'ar' ? 'left-2.5 items-start' : 'right-2.5 items-end'} flex flex-col gap-1`}>
          <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-900/85 text-white backdrop-blur-xs shadow-xs">
            {product.sku}
          </span>
          {product.storageLocation && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-2xs font-medium bg-amber-500/90 text-white shadow-xs backdrop-blur-xs">
              <Archive className="w-3 h-3" />
              {product.storageLocation}
            </span>
          )}
        </div>

        {/* Target Platform Pill at bottom corner */}
        <div className={`absolute bottom-2 ${lang === 'ar' ? 'right-2' : 'left-2'}`}>
          <span className={`px-2 py-0.5 rounded-md text-2xs font-semibold shadow-xs ${platformInfo.color}`}>
            {platformInfo.label}
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-teal-700 tracking-wide">{product.brand || (lang === 'fr' ? 'Sans marque' : 'ماركة غير محددة')}</span>
            {product.size && (
              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-2xs font-medium">
                {lang === 'fr' ? 'Taille' : 'المقاس'}: {product.size}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-teal-700 transition-colors">
            {product.title}
          </h3>

          {/* Condition & Color badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-2xs">
            {conditionInfo && (
              <span className={`px-2 py-0.5 rounded-md border font-medium ${conditionInfo.badgeColor}`}>
                {getConditionName(product.condition)}
              </span>
            )}
            {product.color && (
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                {product.color}
              </span>
            )}
          </div>

          {/* Storage Details */}
          {product.notes && (
            <p className="text-2xs text-slate-500 line-clamp-1 italic mb-3 bg-slate-50 p-1.5 rounded-md border border-slate-100">
              💡 {product.notes}
            </p>
          )}
        </div>

        {/* Pricing & Profit Grid */}
        <div className="pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-xl p-2.5 mb-3 border border-slate-100 text-xs">
            <div>
              <span className="text-2xs text-slate-500 block">{t.cardPurchasePrice}:</span>
              <span className="font-bold text-slate-700 text-sm">
                {product.purchasePrice.toFixed(1)} {currency.symbol}
              </span>
            </div>

            <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
              {isSold && product.saleDetails ? (
                <>
                  <span className="text-2xs text-emerald-600 font-semibold block">{t.soldPriceLabel.replace('*', '')}:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {product.saleDetails.soldPrice.toFixed(1)} {currency.symbol}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xs text-slate-500 block">{t.cardTargetPrice}:</span>
                  <span className="font-bold text-teal-700 text-sm">
                    {product.targetPrice.toFixed(1)} {currency.symbol}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Profit status banner */}
          <div className="flex items-center justify-between text-2xs px-1 mb-3">
            {isSold && product.saleDetails ? (
              <div className="w-full flex items-center justify-between bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">
                <span className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {t.netProfitLabel}:
                </span>
                <span className="font-bold text-xs">
                  +{product.saleDetails.netProfit.toFixed(1)} {currency.symbol} 
                  <span className="text-2xs opacity-80 font-normal mx-1">
                    ({product.saleDetails.roiPercentage.toFixed(0)}% ROI)
                  </span>
                </span>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between text-slate-600">
                <span>{t.cardEstimatedProfit}:</span>
                <span className="font-bold text-teal-600 text-xs">
                  +{potentialProfit.toFixed(1)} {currency.symbol}
                </span>
              </div>
            )}
          </div>

          {/* Vinted Listing Quick Generator Button */}
          <button
            id={`vinted-listing-btn-${product.id}`}
            onClick={() => onGenerateListing(product)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-50 via-teal-100/60 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-800 text-2xs font-bold border border-teal-200/80 transition mb-2 shadow-2xs group/btn cursor-pointer"
            title={t.btnGenerateVinted}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover/btn:scale-110 transition-transform" />
            <span>{t.btnGenerateVinted}</span>
          </button>

          {/* Primary Actions Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            {!isSold ? (
              <>
                <button
                  id={`sell-btn-${product.id}`}
                  onClick={() => onMarkAsSold(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs hover:shadow cursor-pointer"
                  title={t.btnRecordSale}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{t.btnRecordSale}</span>
                </button>

                <button
                  onClick={() => onToggleStatus(product)}
                  className={`py-2 px-2.5 rounded-xl text-2xs font-semibold transition border whitespace-nowrap shrink-0 cursor-pointer ${
                    product.status === 'listed'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                  }`}
                  title={product.status === 'listed' ? t.btnReturnToStorage : t.btnMarkListed}
                >
                  {product.status === 'listed' ? t.btnMarkInStorage : t.btnMarkListed}
                </button>
              </>
            ) : (
              <button
                onClick={() => onToggleStatus(product)}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer"
                title={t.btnReturnToStorage}
              >
                <span>{t.btnReturnToStorage}</span>
              </button>
            )}
          </div>

          {/* Secondary Utilities Row: Edit, Print Tag, Duplicate, Delete */}
          <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(product)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition border border-slate-200/90 cursor-pointer"
                title={t.btnEdit}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onPrintLabel(product)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/90 cursor-pointer"
                title={t.btnPrintLabel}
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDuplicate(product)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/90 cursor-pointer"
                title={t.btnDuplicate}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm(t.confirmDelete)) {
                  onDelete(product.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-slate-200/90 cursor-pointer"
              title={t.btnDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
