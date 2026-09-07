import React, { useState } from 'react';
import { 
  Archive, 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Search 
} from 'lucide-react';
import { Product, Currency } from '../types';
import { useI18n } from '../lib/i18n';

interface StorageLocationsViewProps {
  products: Product[];
  currency: Currency;
  onSelectLocationFilter: (location: string) => void;
  onAddNewProductToLocation: (location: string) => void;
}

export const StorageLocationsView: React.FC<StorageLocationsViewProps> = ({
  products,
  currency,
  onSelectLocationFilter,
  onAddNewProductToLocation,
}) => {
  const { t, lang } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  // Group products by location (focusing on items currently in stock or listed)
  const locationsMap: Record<string, Product[]> = {};
  products.forEach((p) => {
    const loc = p.storageLocation?.trim() || t.unspecifiedBox;
    if (!locationsMap[loc]) {
      locationsMap[loc] = [];
    }
    locationsMap[loc].push(p);
  });

  const locationEntries: [string, Product[]][] = Object.entries(locationsMap).filter(([loc]) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-3xl border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
            <Archive className="w-5 h-5 text-amber-600" />
            <span>{t.storageLocationsTitle}</span>
          </div>
          <p className="text-xs text-amber-800/80 max-w-2xl">
            {t.storageLocationsDesc}
          </p>
        </div>

        {/* Search within locations */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchLocationPlaceholder}
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-amber-500 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Grid of Storage Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locationEntries.map(([locationName, items]) => {
          const inStockItems = items.filter((i) => i.status === 'in_storage' || i.status === 'listed');
          const soldItems = items.filter((i) => i.status === 'sold');
          const totalCostInBox = inStockItems.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
          const totalPotentialValue = inStockItems.reduce((sum, item) => sum + (item.targetPrice || 0), 0);

          return (
            <div
              key={locationName}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Location Title & Count */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200/60">
                      <Archive className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{locationName}</h3>
                      <span className="text-2xs text-slate-500">
                        {inStockItems.length} {t.itemsInStock} {soldItems.length > 0 && `• (${soldItems.length} ${t.soldItemsCount})`}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {inStockItems.length} {t.itemsInBox}
                  </span>
                </div>

                {/* Financial value inside this box */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-2xs mb-3.5">
                  <div>
                    <span className="text-slate-500 block">{t.costInBox}:</span>
                    <strong className="text-slate-800 text-xs">
                      {totalCostInBox.toFixed(1)} {currency.symbol}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.potentialValue}:</span>
                    <strong className="text-teal-700 text-xs">
                      {totalPotentialValue.toFixed(1)} {currency.symbol}
                    </strong>
                  </div>
                </div>

                {/* Thumbnails of items currently in this box */}
                <div className="mb-4">
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {t.latestItemsInLocation}:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="relative w-11 h-11 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-100"
                        title={`${item.sku}: ${item.title}`}
                      >
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xs font-mono">
                            {item.sku}
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length > 5 && (
                      <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-2xs font-bold text-slate-600 shrink-0">
                        +{items.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Box Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectLocationFilter(locationName)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <span>{t.viewBoxItems}</span>
                  {lang === 'fr' ? (
                    <ArrowRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowLeft className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onAddNewProductToLocation(locationName)}
                  className="p-2 rounded-xl border border-slate-200 text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                  title={t.addToThisBox}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {locationEntries.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base mb-1">{t.noMatchingBoxes}</h3>
            <p className="text-xs text-slate-500">{t.noMatchingBoxesDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};
