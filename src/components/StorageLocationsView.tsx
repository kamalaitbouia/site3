import React, { useState, useMemo } from 'react';
import { 
  Archive, 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Search, 
  Printer, 
  Edit3, 
  Boxes, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  FolderOpen,
  DollarSign
} from 'lucide-react';
import { Product, Currency, StorageBox } from '../types';
import { useI18n } from '../lib/i18n';
import { PrintBoxLabelModal } from './PrintBoxLabelModal';

interface StorageLocationsViewProps {
  products: Product[];
  currency: Currency;
  storageBoxes: StorageBox[];
  onSelectLocationFilter: (location: string) => void;
  onAddNewProductToLocation: (location: string) => void;
  onOpenAddBoxModal: () => void;
  onOpenEditBoxModal: (box: StorageBox) => void;
  onDeleteBox: (boxId: string, boxName: string) => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; lightBg: string; ring: string }> = {
  amber: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', lightBg: 'bg-amber-50', ring: 'ring-amber-400' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-700', border: 'border-teal-200', lightBg: 'bg-teal-50', ring: 'ring-teal-400' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', lightBg: 'bg-emerald-50', ring: 'ring-emerald-400' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-200', lightBg: 'bg-indigo-50', ring: 'ring-indigo-400' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-200', lightBg: 'bg-rose-50', ring: 'ring-rose-400' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', lightBg: 'bg-blue-50', ring: 'ring-blue-400' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-200', lightBg: 'bg-purple-50', ring: 'ring-purple-400' },
  slate: { bg: 'bg-slate-500', text: 'text-slate-700', border: 'border-slate-200', lightBg: 'bg-slate-50', ring: 'ring-slate-400' },
};

export const StorageLocationsView: React.FC<StorageLocationsViewProps> = ({
  products,
  currency,
  storageBoxes,
  onSelectLocationFilter,
  onAddNewProductToLocation,
  onOpenAddBoxModal,
  onOpenEditBoxModal,
  onDeleteBox,
}) => {
  const { t, lang } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'occupied' | 'empty'>('all');
  const [boxToPrint, setBoxToPrint] = useState<{ box: StorageBox; count: number } | null>(null);

  // Group products by location
  const productsByLocation = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const loc = p.storageLocation?.trim() || t.unspecifiedBox;
      if (!map[loc]) map[loc] = [];
      map[loc].push(p);
    });
    return map;
  }, [products, t.unspecifiedBox]);

  // Merge defined storageBoxes with any ad-hoc locations found in products
  const allMergedBoxes: { box: StorageBox; items: Product[] }[] = useMemo(() => {
    const definedNames = new Set(storageBoxes.map((b) => b.name.toLowerCase()));
    const result: { box: StorageBox; items: Product[] }[] = [];

    // Add all defined boxes (including empty ones!)
    storageBoxes.forEach((b) => {
      const items = productsByLocation[b.name] || [];
      result.push({ box: b, items });
    });

    // Add any location from products that isn't in defined storageBoxes
    (Object.entries(productsByLocation) as [string, Product[]][]).forEach(([locName, items]) => {
      if (!definedNames.has(locName.toLowerCase())) {
        result.push({
          box: {
            id: `legacy-${locName}`,
            name: locName,
            zone: undefined,
            color: 'slate',
            createdAt: new Date().toISOString(),
          },
          items: items || [],
        });
      }
    });

    return result;
  }, [storageBoxes, productsByLocation]);

  // Compute Overall Storage KPIs
  const storageKPIs = useMemo(() => {
    let totalItems = 0;
    let totalCost = 0;
    let totalPotential = 0;
    let occupiedBoxes = 0;
    let emptyBoxes = 0;

    allMergedBoxes.forEach(({ items }) => {
      const inStock = items.filter((i) => i.status === 'in_storage' || i.status === 'listed');
      if (inStock.length > 0) {
        occupiedBoxes++;
        totalItems += inStock.length;
        inStock.forEach((i) => {
          totalCost += Number(i.purchasePrice) || 0;
          totalPotential += Number(i.targetPrice) || 0;
        });
      } else {
        emptyBoxes++;
      }
    });

    return {
      totalBoxes: allMergedBoxes.length,
      occupiedBoxes,
      emptyBoxes,
      totalItems,
      totalCost,
      totalPotential,
      potentialProfit: Math.max(0, totalPotential - totalCost),
    };
  }, [allMergedBoxes]);

  // Filter boxes by search term and status tab
  const filteredBoxes = useMemo(() => {
    return allMergedBoxes.filter(({ box, items }) => {
      const inStock = items.filter((i) => i.status === 'in_storage' || i.status === 'listed');
      
      // Status filter
      if (statusTab === 'occupied' && inStock.length === 0) return false;
      if (statusTab === 'empty' && inStock.length > 0) return false;

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = box.name.toLowerCase().includes(query);
        const matchesZone = (box.zone || '').toLowerCase().includes(query);
        const matchesNotes = (box.notes || '').toLowerCase().includes(query);
        const matchesItem = items.some(
          (i) => i.title.toLowerCase().includes(query) || i.sku.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesZone && !matchesNotes && !matchesItem) return false;
      }

      return true;
    });
  }, [allMergedBoxes, searchTerm, statusTab]);

  return (
    <div className="space-y-6">
      {/* STORAGE OVERVIEW KPI BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Boxes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold text-slate-500">{t.totalBoxesCount}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {storageKPIs.totalBoxes}
            </span>
            <span className="text-3xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">
              {storageKPIs.occupiedBoxes} {t.filterOccupiedBoxes}
            </span>
          </div>
          <span className="text-3xs text-slate-400 mt-1 block">
            {storageKPIs.emptyBoxes} {t.emptyBoxBadge}
          </span>
        </div>

        {/* Card 2: Total Items Stored */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold text-slate-500">{t.totalItemsInBoxes}</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-teal-700">
              {storageKPIs.totalItems}
            </span>
            <span className="text-3xs text-slate-500">{t.itemsInStock}</span>
          </div>
          <span className="text-3xs text-slate-400 mt-1 block">
            جاهزة للشحن السريع
          </span>
        </div>

        {/* Card 3: Tied Capital in Storage */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold text-slate-500">{t.totalCapitalInBoxes}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {storageKPIs.totalCost.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-500">{currency.symbol}</span>
          </div>
          <span className="text-3xs text-slate-400 mt-1 block">
            رأس المال المجمد في البضاعة
          </span>
        </div>

        {/* Card 4: Potential Sale Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold text-slate-500">{t.potentialProfitInBoxes}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">
              +{storageKPIs.potentialProfit.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-emerald-600">{currency.symbol}</span>
          </div>
          <span className="text-3xs text-slate-400 mt-1 block">
            القيمة البيعية: {storageKPIs.totalPotential.toFixed(1)} {currency.symbol}
          </span>
        </div>
      </div>

      {/* HEADER & ACTION BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Filter Tabs */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.storageLocationsTitle}</h2>
              <p className="text-2xs text-slate-500">{t.storageLocationsDesc}</p>
            </div>
          </div>

          {/* Filter Pills: All / Occupied / Empty */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusTab === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.filterAllBoxes} ({storageKPIs.totalBoxes})
            </button>
            <button
              onClick={() => setStatusTab('occupied')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusTab === 'occupied'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.filterOccupiedBoxes} ({storageKPIs.occupiedBoxes})
            </button>
            <button
              onClick={() => setStatusTab('empty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusTab === 'empty'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.filterEmptyBoxes} ({storageKPIs.emptyBoxes})
            </button>
          </div>
        </div>

        {/* Right: Search & Create New Box Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchLocationPlaceholder}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-3" />
          </div>

          {/* Primary Create New Box Button */}
          <button
            id="create-new-box-btn"
            onClick={onOpenAddBoxModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span>{t.addStorageBoxBtn}</span>
          </button>
        </div>
      </div>

      {/* STORAGE BOXES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBoxes.map(({ box, items }) => {
          const inStockItems = items.filter((i) => i.status === 'in_storage' || i.status === 'listed');
          const soldItems = items.filter((i) => i.status === 'sold');
          const totalCostInBox = inStockItems.reduce((sum, item) => sum + (Number(item.purchasePrice) || 0), 0);
          const totalPotentialValue = inStockItems.reduce((sum, item) => sum + (Number(item.targetPrice) || 0), 0);
          
          const colorTheme = COLOR_MAP[box.color || 'amber'] || COLOR_MAP.amber;
          const capacity = box.capacity || 0;
          const isCapacitySet = capacity > 0;
          const fullnessPercentage = isCapacitySet ? Math.min(100, Math.round((inStockItems.length / capacity) * 100)) : 0;
          const isNearlyFull = isCapacitySet && fullnessPercentage >= 85;

          return (
            <div
              key={box.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Accent Color Bar */}
              <div className={`h-1.5 w-full ${colorTheme.bg}`} />

              <div className="p-5">
                {/* Box Header: Icon, Name, Zone, Edit & Print buttons */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl ${colorTheme.lightBg} ${colorTheme.text} flex items-center justify-center font-bold border ${colorTheme.border} shrink-0`}>
                      <Archive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base truncate">
                          {box.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[130px]">
                          {box.zone || t.storageLocationsTitle}
                        </span>
                        {inStockItems.length === 0 && (
                          <span className="text-3xs font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {t.emptyBoxBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Right Box Utilities: Edit & Print */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setBoxToPrint({ box, count: inStockItems.length })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title={t.printBoxLabelBtn}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenEditBoxModal(box)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                      title={t.editStorageBoxTitle}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Capacity Progress Bar (if capacity is defined) */}
                {isCapacitySet && (
                  <div className="mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-3xs font-bold mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <span>{t.boxCapacityFullness}:</span>
                        <span>{inStockItems.length} / {capacity}</span>
                      </span>
                      <span className={isNearlyFull ? 'text-amber-600' : 'text-slate-700'}>
                        {fullnessPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNearlyFull ? 'bg-amber-500' : colorTheme.bg
                        }`}
                        style={{ width: `${fullnessPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Box Notes */}
                {box.notes && (
                  <p className="text-3xs text-slate-500 mb-3 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-100/80 line-clamp-2">
                    {box.notes}
                  </p>
                )}

                {/* Financial value inside this box */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-2xs mb-3.5">
                  <div>
                    <span className="text-slate-500 block text-3xs">{t.costInBox}:</span>
                    <strong className="text-slate-900 text-xs font-black">
                      {totalCostInBox.toFixed(1)} {currency.symbol}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-3xs">{t.potentialValue}:</span>
                    <strong className="text-teal-700 text-xs font-black">
                      {totalPotentialValue.toFixed(1)} {currency.symbol}
                    </strong>
                  </div>
                </div>

                {/* Thumbnails of items currently in this box */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-3xs font-semibold text-slate-400 mb-1.5">
                    <span>{t.latestItemsInLocation}</span>
                    <span className="font-bold text-slate-600">
                      {inStockItems.length} {t.itemsInStock}
                    </span>
                  </div>

                  {inStockItems.length > 0 ? (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {inStockItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onSelectLocationFilter(box.name)}
                          className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 cursor-pointer hover:ring-2 hover:ring-teal-500 transition"
                          title={`${item.sku}: ${item.title}`}
                        >
                          {item.images && item.images[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xs font-mono">
                              {item.sku}
                            </div>
                          )}
                        </div>
                      ))}
                      {inStockItems.length > 5 && (
                        <button
                          onClick={() => onSelectLocationFilter(box.name)}
                          className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 hover:bg-slate-200 transition cursor-pointer"
                        >
                          +{inStockItems.length - 5}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-xl p-3 text-center">
                      <span className="text-3xs text-slate-400 block font-medium">
                        {t.emptyBoxDesc}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Box Bottom Action Buttons */}
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectLocationFilter(box.name)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                >
                  <span>{t.viewBoxItems}</span>
                  {lang === 'fr' ? (
                    <ArrowRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowLeft className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onAddNewProductToLocation(box.name)}
                  className="flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  title={t.addToThisBox}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-3xs">{t.addToThisBox}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredBoxes.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base mb-1">{t.noMatchingBoxes}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.noMatchingBoxesDesc}</p>
            <button
              onClick={onOpenAddBoxModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addStorageBoxBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* PRINT BOX LABEL MODAL */}
      <PrintBoxLabelModal
        isOpen={!!boxToPrint}
        onClose={() => setBoxToPrint(null)}
        box={boxToPrint?.box || null}
        itemsCount={boxToPrint?.count || 0}
      />
    </div>
  );
};
