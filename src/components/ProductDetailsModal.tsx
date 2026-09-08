import React, { useState } from 'react';
import { 
  X, 
  Archive, 
  Tag, 
  DollarSign, 
  Sparkles, 
  Printer, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  Calendar,
  Layers,
  ShoppingBag,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { Product, Currency } from '../types';
import { CONDITIONS, PLATFORMS, STATUS_LABELS } from '../lib/constants';
import { useI18n } from '../lib/i18n';

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (id: string) => void;
  onMarkAsSold: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onPrintLabel: (product: Product) => void;
  onGenerateListing: (product: Product) => void;
  onUpdateLocation?: (productId: string, newLocation: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  product,
  currency,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onMarkAsSold,
  onToggleStatus,
  onPrintLabel,
  onGenerateListing,
  onUpdateLocation,
}) => {
  const { t, lang, getCategoryName, getConditionName, getStatusName } = useI18n();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [editingLocation, setEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [locationSaved, setLocationSaved] = useState(false);

  if (!isOpen || !product) return null;

  const isSold = product.status === 'sold';
  const statusInfo = STATUS_LABELS[product.status] || STATUS_LABELS.in_storage;
  const conditionInfo = CONDITIONS.find((c) => c.id === product.condition);
  const platformInfo = PLATFORMS.find((p) => p.id === product.targetPlatform) || PLATFORMS[0];
  const potentialProfit = Math.max(0, product.targetPrice - product.purchasePrice);

  const handleSaveLocation = () => {
    if (!newLocation.trim() || !onUpdateLocation) return;
    onUpdateLocation(product.id, newLocation.trim());
    product.storageLocation = newLocation.trim();
    setLocationSaved(true);
    setEditingLocation(false);
    setTimeout(() => setLocationSaved(false), 2500);
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-xs">
              {product.sku}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs ${statusInfo.bg} ${statusInfo.color}`}>
              {getStatusName(product.status)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Compact Product Header with 20% Size Image & Details */}
          <div className="bg-slate-50/80 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 space-y-2.5">
            <div className="flex items-start gap-3">
              {/* 20% Size Compact Image Preview */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute bottom-1 start-1 px-1.5 py-0.5 rounded text-3xs font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                  {platformInfo.label}
                </span>
                {images.length > 1 && (
                  <span className="absolute top-1 end-1 px-1.5 py-0.2 rounded text-3xs font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {activeImageIndex + 1}/{images.length}
                  </span>
                )}
              </div>

              {/* Title & Core Details next to compact image */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 text-xs mb-1">
                  <span className="font-bold text-teal-700 tracking-wide text-xs truncate">
                    {product.brand || (lang === 'fr' ? 'Sans marque' : 'ماركة غير محددة')}
                  </span>
                  <span className="text-3xs bg-white text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200 shrink-0">
                    {getCategoryName(product.category)}
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2">
                  {product.title}
                </h2>

                {/* Badges: Size, Color, Condition */}
                <div className="flex flex-wrap items-center gap-1 mt-2">
                  {product.size && (
                    <span className="bg-white text-slate-800 px-2 py-0.5 rounded-md text-3xs font-bold border border-slate-200">
                      {lang === 'fr' ? 'Taille:' : 'المقاس:'} {product.size}
                    </span>
                  )}
                  {product.color && (
                    <span className="bg-white text-slate-700 px-2 py-0.5 rounded-md text-3xs font-medium border border-slate-200">
                      {product.color}
                    </span>
                  )}
                  {conditionInfo && (
                    <span className={`px-2 py-0.5 rounded-md text-3xs font-bold border ${conditionInfo.badgeColor}`}>
                      {getConditionName(product.condition)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pt-1 border-t border-slate-200/60">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-teal-600 shadow-2xs scale-102' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {product.notes && (
              <p className="text-2xs text-slate-600 bg-white p-2 rounded-xl border border-slate-200 italic">
                💡 {product.notes}
              </p>
            )}
          </div>

          {/* PROMINENT SHELF / STORAGE LOCATION CARD */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 border border-amber-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-amber-700 block">
                    {lang === 'fr' ? 'Emplacement / Rayon de stockage' : 'رقم الرف / صندوق التخزين'}
                  </span>
                  <span className="text-base font-black text-amber-950">
                    📦 {product.storageLocation || (lang === 'fr' ? 'Non spécifié' : 'غير محدد')}
                  </span>
                </div>
              </div>

              {locationSaved && (
                <span className="text-3xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md animate-in fade-in">
                  {lang === 'fr' ? '✓ Enregistré !' : '✓ تم حفظ الموقع!'}
                </span>
              )}

              {!editingLocation && onUpdateLocation && (
                <button
                  type="button"
                  onClick={() => {
                    setNewLocation(product.storageLocation || '');
                    setEditingLocation(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-300 text-amber-900 text-xs font-bold transition cursor-pointer"
                >
                  {lang === 'fr' ? 'Modifier le rayon' : 'تغيير الرف'}
                </button>
              )}
            </div>

            {/* Quick Edit Location Form */}
            {editingLocation && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-amber-200/60">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={lang === 'fr' ? 'ex: Rayon B-02, Boîte 4' : 'مثال: رف B-02، صندوق 4'}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-amber-300 bg-white text-slate-800 focus:outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={handleSaveLocation}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
                >
                  {lang === 'fr' ? 'Valider' : 'حفظ'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLocation(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition shrink-0 cursor-pointer border border-slate-200"
                >
                  {t.btnCancel}
                </button>
              </div>
            )}
          </div>

          {/* FINANCIAL SUMMARY CARD */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-3xs text-slate-400 block mb-0.5">
                  {t.cardPurchasePrice}
                </span>
                <span className="text-sm sm:text-base font-black text-slate-700">
                  {product.purchasePrice.toFixed(1)} {currency.symbol}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-3xs text-slate-400 block mb-0.5">
                  {isSold ? (lang === 'fr' ? 'Prix vendu' : 'سعر البيع الفعلي') : t.cardTargetPrice}
                </span>
                <span className="text-sm sm:text-base font-black text-teal-700">
                  {isSold && product.saleDetails 
                    ? `${product.saleDetails.soldPrice.toFixed(1)} ${currency.symbol}`
                    : `${product.targetPrice.toFixed(1)} ${currency.symbol}`}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-3xs text-slate-400 block mb-0.5">
                  {isSold ? t.cardNetProfit : t.cardEstimatedProfit}
                </span>
                <span className={`text-sm sm:text-base font-black ${isSold ? 'text-emerald-700' : 'text-teal-600'}`}>
                  +{isSold && product.saleDetails
                    ? product.saleDetails.netProfit.toFixed(1)
                    : potentialProfit.toFixed(1)} {currency.symbol}
                </span>
              </div>
            </div>

            {/* Extra Sold Details if item is already sold */}
            {isSold && product.saleDetails && (
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-2xs text-slate-600">
                <span>
                  {lang === 'fr' ? 'Date de vente :' : 'تاريخ البيع:'} {product.saleDetails.saleDate}
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ROI: {product.saleDetails.roiPercentage.toFixed(0)}%
                </span>
                {product.saleDetails.buyerName && (
                  <span>
                    {lang === 'fr' ? 'Acheteur :' : 'المشتري:'} {product.saleDetails.buyerName}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* MAIN ACTIONS */}
          <div className="space-y-2 pt-2">
            {!isSold ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onMarkAsSold(product);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-5 h-5" />
                <span>{t.btnRecordSale}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onToggleStatus(product);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>{t.btnReturnToStorage}</span>
              </button>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGenerateListing(product);
                }}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-2xs border border-teal-200 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Vinted</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPrintLabel(product);
                }}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-2xs border border-slate-200 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{t.btnPrintLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-2xs border border-slate-200 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>{t.btnEdit}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDuplicate(product);
                }}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-2xs border border-slate-200 transition cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{t.btnDuplicate}</span>
              </button>
            </div>

            {/* Bottom Secondary Actions: Status toggle & Delete */}
            <div className="flex items-center justify-between pt-2">
              {!isSold && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onToggleStatus(product);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-teal-700 transition flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>
                    {product.status === 'listed' ? t.btnMarkInStorage : t.btnMarkListed}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t.confirmDelete)) {
                    onClose();
                    onDelete(product.id);
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition flex items-center gap-1 cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.btnDelete}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
