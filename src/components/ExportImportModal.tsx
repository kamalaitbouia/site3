import React, { useRef } from 'react';
import { Download, FileSpreadsheet, RotateCcw, Upload, X } from 'lucide-react';
import { Product } from '../types';
import { exportProductsCSV, exportProductsJSON, INITIAL_PRODUCTS } from '../lib/storage';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onImportProducts: (newProducts: Product[]) => void;
  onResetSampleData: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  products,
  onImportProducts,
  onResetSampleData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportProducts(parsed);
          onClose();
        } else {
          alert('الملف المرفوع غير صالح، يجب أن يحتوي على مصفوفة منتجات.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف، تأكد من أنه ملف JSON صالح.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">النسخ الاحتياطي وتصدير البيانات</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            بيانات مخزونك وأرباحك محفوظة محلياً على جهازك. استخدم الخيارات التالية لتأمين نسخة احتياطية أو تصديرها إلى Excel:
          </p>

          <div className="space-y-2.5">
            {/* Export CSV */}
            <button
              onClick={() => exportProductsCSV(products)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                    تصدير إلى ملف إكسل (CSV)
                  </h4>
                  <span className="text-2xs text-slate-500">
                    جرد كامل لكافة المنتجات والأسعار والمواقع والأرباح
                  </span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            </button>

            {/* Export JSON Backup */}
            <button
              onClick={() => exportProductsJSON(products)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                    حفظ نسخة احتياطية كاملة (JSON)
                  </h4>
                  <span className="text-2xs text-slate-500">
                    ملف يحتوي على كل الصور والبيانات لنقلها لجهاز آخر
                  </span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            </button>

            {/* Import JSON */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                      استعادة نسخة احتياطية من ملف (JSON)
                    </h4>
                    <span className="text-2xs text-slate-500">
                      استرجاع بياناتك المخزنة مسبقاً
                    </span>
                  </div>
                </div>
                <Upload className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </button>
            </div>

            {/* Reset to sample data */}
            <button
              onClick={() => {
                if (window.confirm('هل تريد بالتأكيد إعادة تعيين البيانات إلى البيانات التجريبية الأولية؟')) {
                  onResetSampleData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-100/50 transition text-right group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    إعادة ضبط البيانات التجريبية
                  </h4>
                  <span className="text-2xs text-amber-700">
                    استرجاع الأمثلة التوضيحية لمنتجات Vinted
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
