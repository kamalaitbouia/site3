import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  Camera, 
  DollarSign, 
  ImagePlus, 
  Package, 
  Sparkles, 
  Tag, 
  Upload, 
  X 
} from 'lucide-react';
import { Product, Category, Condition, SellingPlatform, Currency } from '../types';
import { CATEGORIES, CONDITIONS, PLATFORMS, COMMON_STORAGE_LOCATIONS } from '../lib/constants';
import { useI18n } from '../lib/i18n';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  productToEdit?: Product | null;
  suggestedSku: string;
  currency: Currency;
  existingLocations: string[];
  initialLocation?: string;
}

const POPULAR_BRANDS = ['Zara', 'Nike', 'Adidas', "Levi's", 'Ralph Lauren', 'Massimo Dutti', 'Mango', 'H&M', 'Vintage', 'Tommy Hilfiger'];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  suggestedSku,
  currency,
  existingLocations,
  initialLocation,
}) => {
  const { t, lang, getCategoryName, getConditionName } = useI18n();

  const [sku, setSku] = useState(suggestedSku);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category>('clothing');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState<Condition>('very_good');
  const [storageLocation, setStorageLocation] = useState('صندوق A1');
  const [notes, setNotes] = useState('');
  
  const [purchasePrice, setPurchasePrice] = useState<number | ''>(5);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [sourceLocation, setSourceLocation] = useState('');
  const [targetPrice, setTargetPrice] = useState<number | ''>(25);
  const [targetPlatform, setTargetPlatform] = useState<SellingPlatform>('vinted');
  const [status, setStatus] = useState<Product['status']>('in_storage');
  
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Combine storage locations list
  const allLocations = Array.from(new Set([...COMMON_STORAGE_LOCATIONS, ...existingLocations])).filter(Boolean);

  useEffect(() => {
    if (productToEdit) {
      setSku(productToEdit.sku || suggestedSku);
      setTitle(productToEdit.title || '');
      setBrand(productToEdit.brand || '');
      setCategory(productToEdit.category || 'clothing');
      setSize(productToEdit.size || '');
      setColor(productToEdit.color || '');
      setCondition(productToEdit.condition || 'very_good');
      setStorageLocation(productToEdit.storageLocation || 'صندوق A1');
      setNotes(productToEdit.notes || '');
      setPurchasePrice(productToEdit.purchasePrice ?? 5);
      setPurchaseDate(productToEdit.purchaseDate || new Date().toISOString().slice(0, 10));
      setSourceLocation(productToEdit.sourceLocation || '');
      setTargetPrice(productToEdit.targetPrice ?? 25);
      setTargetPlatform(productToEdit.targetPlatform || 'vinted');
      setStatus(productToEdit.status || 'in_storage');
      setImages(productToEdit.images || []);
    } else {
      setSku(suggestedSku);
      setTitle('');
      setBrand('');
      setCategory('clothing');
      setSize('');
      setColor('');
      setCondition('very_good');
      setStorageLocation(initialLocation || allLocations[0] || 'صندوق A1');
      setNotes('');
      setPurchasePrice(5);
      setPurchaseDate(new Date().toISOString().slice(0, 10));
      setSourceLocation('');
      setTargetPrice(25);
      setTargetPlatform('vinted');
      setStatus('in_storage');
      setImages([]);
    }
  }, [productToEdit, suggestedSku, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload (converts to data URL so it works offline and in browser)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedCost = typeof purchasePrice === 'number' ? purchasePrice : parseFloat(purchasePrice) || 0;
    const parsedTarget = typeof targetPrice === 'number' ? targetPrice : parseFloat(targetPrice) || 0;

    // Sanitize SKU from invisible characters, RTL/LTR marks, and trim
    const cleanSkuValue = (sku.trim() || suggestedSku)
      .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E\u00A0\r\n\t]/g, '')
      .trim();

    onSave({
      id: productToEdit?.id,
      sku: cleanSkuValue,
      title: title.trim(),
      brand: brand.trim(),
      category,
      size: size.trim(),
      color: color.trim(),
      condition,
      storageLocation: storageLocation.trim() || 'صندوق 1',
      notes: notes.trim(),
      purchasePrice: parsedCost,
      purchaseDate,
      sourceLocation: sourceLocation.trim(),
      targetPrice: parsedTarget,
      targetPlatform,
      status,
      images,
      saleDetails: productToEdit?.saleDetails,
    });

    onClose();
  };

  // Potential profit preview calculation
  const numericCost = typeof purchasePrice === 'number' ? purchasePrice : parseFloat(purchasePrice) || 0;
  const numericTarget = typeof targetPrice === 'number' ? targetPrice : parseFloat(targetPrice) || 0;
  const estProfit = Math.max(0, numericTarget - numericCost);
  const estMargin = numericTarget > 0 ? ((estProfit / numericTarget) * 100).toFixed(0) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                {productToEdit ? t.editProductTitle : t.addProductTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.addProductDesc}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Section 1: Photos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.productPhotosLabel}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mb-2.5">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition shadow cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Upload trigger */}
              <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-500 bg-slate-50/60 hover:bg-teal-50/30 cursor-pointer transition text-slate-400 hover:text-teal-600">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-2xs font-semibold">{t.takePhoto}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Optional URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder={t.pasteImageUrl}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                {t.addImageUrl}
              </button>
            </div>
          </div>

          {/* Section 2: Essential Info (SKU, Title, Brand) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {t.productSkuLabel}
                </label>
                <span className="text-3xs text-slate-400 font-normal">
                  {lang === 'fr' ? 'Code SKU unique' : 'رمز التتبع بالمخزن'}
                </span>
              </div>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="VIN-1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800 focus:border-teal-500 focus:outline-hidden"
              />
              <span className="text-3xs text-slate-400 mt-1 block">
                {lang === 'fr' ? 'VIN = Vinted Item. Modifiable à volonté.' : 'VIN تعني Vinted. يمكنك كتابة أي كود يناسبك.'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.productTitleLabel}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'fr' ? 'ex: Veste en jean Vintage classique taille L' : 'مثال: جاكيت جينز Vintage كلاسيكي مقاس L'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.brandLabel}
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Zara, Nike, Vintage, Ralph Lauren..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                {POPULAR_BRANDS.slice(0, 5).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className="text-2xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition cursor-pointer"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden bg-white cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getCategoryName(c.id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Size, Color, Condition */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.sizeLabel}
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="S, M, L, 42, 38..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.colorLabel}
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder={lang === 'fr' ? 'Bleu, Noir, Beige...' : 'أزرق، أسود، بيج...'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.conditionLabel}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden bg-white cursor-pointer"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getConditionName(c.id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Storage Location (The core feature for pre-sale storage!) */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
            <div className="flex items-center gap-2 mb-2">
              <Archive className="w-4 h-4 text-amber-600" />
              <label className="text-xs font-bold text-amber-900">
                {t.storageLocationLabel}
              </label>
            </div>
            <p className="text-2xs text-amber-800/80 mb-2.5">
              {t.storageLocationDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder={lang === 'fr' ? 'Boîte A1, Rayon 3...' : 'اكتب أو اختر e.g. صندوق A1، شماعة 3...'}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs font-bold text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
              <div className="flex flex-wrap gap-1 items-center">
                {allLocations.slice(0, 4).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setStorageLocation(loc)}
                    className={`text-2xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      storageLocation === loc
                        ? 'bg-amber-600 text-white border-amber-600 font-bold'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/70'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Pricing & Sourcing (Cost & Target Profit) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-600" />
              {t.pricingSectionTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1">
                  {t.purchasePriceModalLabel} ({currency.symbol}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1">
                  {t.targetPriceModalLabel} ({currency.symbol}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-teal-700 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1">
                  {t.targetPlatformLabel}
                </label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value as SellingPlatform)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profit preview banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-xs">
              <span className="text-teal-900 font-medium">{t.expectedNetProfitLabel}:</span>
              <div className="flex items-baseline gap-1.5 font-bold text-teal-700">
                <span className="text-sm">+{estProfit.toFixed(1)} {currency.symbol}</span>
                <span className="text-2xs bg-teal-200/70 text-teal-900 px-2 py-0.5 rounded-md">
                  {t.marginLabel} {estMargin}%
                </span>
              </div>
            </div>

            {/* Sourcing place & date */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-2xs font-medium text-slate-500 mb-1">
                  {t.purchaseDateLabel}
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block text-2xs font-medium text-slate-500 mb-1">
                  {t.sourceLocationLabel}
                </label>
                <input
                  type="text"
                  value={sourceLocation}
                  onChange={(e) => setSourceLocation(e.target.value)}
                  placeholder={lang === 'fr' ? 'Brocante, Friperie, Vinted...' : 'سوق المستعمل، تخفيضات، أوتلت...'}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Current Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.statusCurrentLabel}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Product['status'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden bg-white font-medium cursor-pointer"
              >
                <option value="in_storage">📦 {lang === 'fr' ? 'En stock (au dépôt)' : 'في المخزن (جاهز للإدراج والتصوير)'}</option>
                <option value="listed">🏷️ {lang === 'fr' ? 'Mis en vente (sur Vinted)' : 'معروض للبيع (على Vinted الآن)'}</option>
                <option value="shipped">🚚 {lang === 'fr' ? 'Expédié au client' : 'تم الشحن للعميل'}</option>
                <option value="archived">📁 {lang === 'fr' ? 'Archivé / Annulé' : 'مؤرشف / ملغي'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.notesDefectsLabel}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'fr' ? 'Ex: Bouton manquant, tissu à repasser...' : 'مثال: زر مفقود، قماش يحتاج كوي...'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              id="save-product-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {productToEdit ? t.saveChanges : t.addToInventory}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
