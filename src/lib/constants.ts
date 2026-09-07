import { Category, Condition, Currency, SellingPlatform } from '../types';

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', nameAr: 'يورو (€)' },
  { code: 'USD', symbol: '$', nameAr: 'دولار ($)' },
  { code: 'MAD', symbol: 'د.م', nameAr: 'درهم مغربي (د.م)' },
  { code: 'SAR', symbol: 'ر.س', nameAr: 'ريال سعودي (ر.س)' },
  { code: 'GBP', symbol: '£', nameAr: 'جنيه إسترليني (£)' },
  { code: 'TND', symbol: 'د.ت', nameAr: 'دينار تونسي (د.ت)' },
  { code: 'DZD', symbol: 'د.ج', nameAr: 'دينار جزائري (د.ج)' },
];

export const CATEGORIES: { id: Category; labelAr: string; icon: string }[] = [
  { id: 'clothing', labelAr: 'ملابس', icon: 'Shirt' },
  { id: 'shoes', labelAr: 'أحذية', icon: 'Footprints' },
  { id: 'bags', labelAr: 'حقائب ومحافظ', icon: 'ShoppingBag' },
  { id: 'accessories', labelAr: 'إكسسوارات وساعات', icon: 'Watch' },
  { id: 'electronics', labelAr: 'إلكترونيات', icon: 'Smartphone' },
  { id: 'beauty', labelAr: 'عناية وجمال', icon: 'Sparkles' },
  { id: 'home', labelAr: 'ديكور ومنزل', icon: 'Home' },
  { id: 'other', labelAr: 'أخرى', icon: 'Package' },
];

export const CONDITIONS: { id: Condition; labelAr: string; badgeColor: string }[] = [
  { id: 'new_with_tag', labelAr: 'جديد مع التيكيت (NWT)', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'new_no_tag', labelAr: 'جديد بدون تيكيت', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'very_good', labelAr: 'حالة ممتازة (بدون عيوب)', badgeColor: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'good', labelAr: 'حالة جيدة (استعمال بسيط)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'satisfactory', labelAr: 'مقبول (به أثر استخدام)', badgeColor: 'bg-stone-100 text-stone-700 border-stone-300' },
];

export const PLATFORMS: { id: SellingPlatform; label: string; color: string }[] = [
  { id: 'vinted', label: 'Vinted', color: 'bg-teal-500 text-white' },
  { id: 'ebay', label: 'eBay', color: 'bg-blue-600 text-white' },
  { id: 'depop', label: 'Depop', color: 'bg-red-500 text-white' },
  { id: 'marketplace', label: 'FB Marketplace', color: 'bg-indigo-600 text-white' },
  { id: 'vestiaire', label: 'Vestiaire Collective', color: 'bg-amber-600 text-white' },
  { id: 'other', label: 'منصة أخرى', color: 'bg-slate-600 text-white' },
];

export const STATUS_LABELS: Record<string, { labelAr: string; color: string; bg: string }> = {
  in_storage: { labelAr: 'في المخزن', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  listed: { labelAr: 'معروض للبيع', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  sold: { labelAr: 'تم البيع 🎉', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  shipped: { labelAr: 'تم الشحن', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  archived: { labelAr: 'مؤرشف / ملغي', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' },
};

export const COMMON_STORAGE_LOCATIONS = [
  'صندوق A1',
  'صندوق A2',
  'صندوق B1',
  'صندوق B2',
  'الرف العلوي',
  'الرف الأوسط',
  'شماعة الملابس 1',
  'حقيبة التخزين 1',
  'خزانة الأحذية',
];
