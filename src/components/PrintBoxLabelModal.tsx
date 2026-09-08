import React from 'react';
import { X, Printer, Archive, Sparkles, Tag } from 'lucide-react';
import { StorageBox } from '../types';
import { useI18n } from '../lib/i18n';

interface PrintBoxLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: StorageBox | null;
  itemsCount: number;
}

export const PrintBoxLabelModal: React.FC<PrintBoxLabelModalProps> = ({
  isOpen,
  onClose,
  box,
  itemsCount,
}) => {
  const { t, lang } = useI18n();

  if (!isOpen || !box) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">{t.printBoxLabelBtn}</h2>
              <p className="text-2xs text-slate-500">{t.boxLabelSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6">
          <div
            id="printable-box-label"
            className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center space-y-4 shadow-xs"
          >
            {/* Top Brand & Type */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Archive className="w-4 h-4 text-teal-600" />
                <span>{t.appName}</span>
              </div>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {box.zone || t.storageLocationsTitle}
              </span>
            </div>

            {/* Giant Box Name */}
            <div className="py-2">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t.boxNameLabel}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {box.name}
              </h1>
            </div>

            {/* Visual Simulated Barcode for the Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
              {/* Barcode lines */}
              <div className="h-14 flex items-end gap-1 px-4 mb-2">
                {[4, 2, 6, 3, 1, 5, 2, 7, 3, 2, 5, 1, 4, 6, 2, 3, 5, 1, 7, 3, 2, 4, 6, 2].map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-900 rounded-xs"
                    style={{
                      width: i % 3 === 0 ? '4px' : i % 2 === 0 ? '2px' : '3px',
                      height: `${h * 7 + 10}px`,
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 tracking-widest">
                *{box.name.replace(/\s+/g, '-').toUpperCase()}*
              </span>
            </div>

            {/* Box Meta: Capacity / Items count */}
            <div className="grid grid-cols-2 gap-2 text-2xs text-slate-600 pt-1">
              <div className="bg-slate-100/80 p-2 rounded-xl">
                <span className="text-slate-400 block">{t.itemsInBox}:</span>
                <strong className="text-slate-800 text-xs">{itemsCount} قطع</strong>
              </div>
              <div className="bg-slate-100/80 p-2 rounded-xl">
                <span className="text-slate-400 block">{t.boxZoneLabel}:</span>
                <strong className="text-slate-800 text-xs">{box.zone || '—'}</strong>
              </div>
            </div>

            {box.notes && (
              <p className="text-2xs text-slate-500 italic bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                {box.notes}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
          >
            {t.btnCancel}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
