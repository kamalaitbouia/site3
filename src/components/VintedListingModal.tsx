import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  FileText, 
  Sparkles, 
  Tag, 
  X 
} from 'lucide-react';
import { Product } from '../types';
import { generateVintedListing, VintedLang } from '../lib/vintedListingGenerator';
import { useI18n } from '../lib/i18n';

interface VintedListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const VintedListingModal: React.FC<VintedListingModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { t } = useI18n();
  const [selectedLang, setSelectedLang] = useState<VintedLang>('fr');
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');
  const [copiedSection, setCopiedSection] = useState<'all' | 'title' | 'desc' | null>(null);

  // Update listing when product or language changes
  useEffect(() => {
    if (product) {
      const generated = generateVintedListing(product, selectedLang);
      setEditableTitle(generated.title);
      setEditableDescription(generated.fullText);
      setCopiedSection(null);
    }
  }, [product, selectedLang]);

  if (!isOpen || !product) return null;

  const handleCopy = async (text: string, section: 'all' | 'title' | 'desc') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                <span>{t.vintedGeneratorTitle}</span>
                <span className="text-3xs font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
                  {product.sku}
                </span>
              </h3>
              <p className="text-2xs text-slate-500">
                {t.vintedGeneratorDesc}
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

        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Language Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-100/90 p-1.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
              <span>{t.adLanguage}:</span>
            </span>
            <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center">
              <button
                onClick={() => setSelectedLang('fr')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  selectedLang === 'fr'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇫🇷 {t.frenchLang}</span>
                <span className="hidden sm:inline text-3xs font-normal text-teal-600">({t.recommended})</span>
              </button>

              <button
                onClick={() => setSelectedLang('en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  selectedLang === 'en'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇬🇧 {t.englishLang}</span>
              </button>

              <button
                onClick={() => setSelectedLang('ar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  selectedLang === 'ar'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇸🇦 {t.arabicLang}</span>
              </button>
            </div>
          </div>

          {/* Product Quick Recap Bar */}
          <div className="flex items-center gap-3 bg-teal-50/60 p-3 rounded-2xl border border-teal-100 text-xs">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-teal-200" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center font-mono text-teal-700 font-bold text-xs">
                {product.sku}
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 line-clamp-1">{product.title}</h4>
              <div className="flex items-center gap-2 text-2xs text-slate-600 mt-0.5">
                <span>{t.brand}: <strong>{product.brand || t.unspecified}</strong></span>
                <span>•</span>
                <span>{t.sizeLabel}: <strong>{product.size || t.unspecified}</strong></span>
                <span>•</span>
                <span>{t.storageLocation}: <strong className="text-amber-800">📦 {product.storageLocation}</strong></span>
              </div>
            </div>
          </div>

          {/* Title Field with Copy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.vintedTitleLabel}:</span>
              </label>
              <button
                onClick={() => handleCopy(editableTitle, 'title')}
                className="text-2xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
              >
                {copiedSection === 'title' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">{t.titleCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.copyTitleOnly}</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-teal-500 focus:bg-white transition"
              dir="auto"
            />
          </div>

          {/* Full Description Field with Copy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.vintedDescLabel}:</span>
              </label>
              <button
                onClick={() => handleCopy(editableDescription, 'desc')}
                className="text-2xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
              >
                {copiedSection === 'desc' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">{t.descCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.copyDescOnly}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={8}
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-normal leading-relaxed focus:outline-hidden focus:border-teal-500 focus:bg-white transition font-sans"
              dir="auto"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="text-2xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <span>💡 {t.vintedTip}</span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition shrink-0 cursor-pointer"
              >
                {t.close}
              </button>

              <button
                onClick={() => handleCopy(`${editableTitle}\n\n${editableDescription}`, 'all')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition shrink-0 cursor-pointer ${
                  copiedSection === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
                }`}
              >
                {copiedSection === 'all' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.fullAdCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t.copyFullAd}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
