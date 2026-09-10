import React, { useEffect, useRef } from 'react';
import { Printer, X } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { Product, Currency } from '../types';
import { useI18n } from '../lib/i18n';
import { cleanSku } from './BarcodeScannerModal';

interface PrintLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  currency: Currency;
}

export const PrintLabelsModal: React.FC<PrintLabelsModalProps> = ({
  isOpen,
  onClose,
  product,
  currency,
}) => {
  const { t } = useI18n();
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (isOpen && product?.sku && barcodeSvgRef.current) {
      try {
        const barcodeText = cleanSku(product.sku) || product.sku;
        JsBarcode(barcodeSvgRef.current, barcodeText, {
          format: 'CODE128',
          lineColor: '#0f172a',
          width: 2.2,
          height: 48,
          displayValue: true,
          font: 'monospace',
          fontSize: 13,
          textMargin: 4,
          background: '#ffffff',
          margin: 4,
        });
      } catch (err) {
        console.warn('JsBarcode rendering error:', err);
      }
    }
  }, [isOpen, product?.sku]);

  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">{t.printLabelTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Preview Area */}
        <div className="p-6 space-y-4">
          <p className="text-2xs text-slate-500 text-center">
            {t.printLabelDesc}
          </p>

          {/* Actual Printable Tag Card */}
          <div 
            id="printable-tag"
            className="border-2 border-dashed border-slate-400 rounded-2xl p-5 bg-white text-slate-900 space-y-3 shadow-xs"
          >
            {/* Top row: Brand & SKU */}
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="font-mono text-lg font-black tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded">
                {product.sku}
              </span>
              <span className="font-bold text-sm text-teal-800 uppercase tracking-wide">
                {product.brand || 'VINTED ITEM'}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-bold text-sm text-slate-800 leading-snug">
              {product.title}
            </h4>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-2xs">{t.storageLocation}:</span>
                <strong className="text-amber-800 text-xs font-bold">
                  📦 {product.storageLocation}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-2xs">{t.sizeLabel}:</span>
                <strong className="text-slate-800">{product.size || t.unspecified}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-2xs">{t.colorLabel}:</span>
                <strong className="text-slate-800">{product.color || t.unspecified}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-2xs">{t.targetPriceLabel}:</span>
                <strong className="text-teal-700">{product.targetPrice} {currency.symbol}</strong>
              </div>
            </div>

            {/* Real Scannable Barcode */}
            <div className="pt-2 flex flex-col items-center justify-center bg-white rounded-xl p-2 border border-slate-200/80">
              <svg ref={barcodeSvgRef} className="max-w-full h-auto" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              {t.close}
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
