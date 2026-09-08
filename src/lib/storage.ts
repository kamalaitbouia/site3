import { Product, ResellerStats, SaleDetails, StorageBox } from '../types';

const STORAGE_KEY = 'makhzooni_products_v1';
const CURRENCY_KEY = 'makhzooni_currency_v1';
const STORAGE_BOXES_KEY = 'makhzooni_storage_boxes_v2';

export const DEFAULT_STORAGE_BOXES: StorageBox[] = [
  {
    id: 'box-1',
    name: 'صندوق A1',
    zone: 'الرف العلوي',
    color: 'amber',
    capacity: 20,
    notes: 'ملابس خفيفة وإكسسوارات معروضة للبيع',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'box-2',
    name: 'صندوق B2',
    zone: 'الرف الأوسط',
    color: 'teal',
    capacity: 12,
    notes: 'أحذية وسنيكرز تم تنظيفها',
    createdAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 'box-3',
    name: 'شماعة الملابس 1',
    zone: 'ركن الشماعات',
    color: 'indigo',
    capacity: 25,
    notes: 'قمصان وجاكيتات معلقة وجاهزة للشحن',
    createdAt: '2025-01-03T00:00:00.000Z',
  },
  {
    id: 'box-4',
    name: 'صندوق C3',
    zone: 'الرف السفلي',
    color: 'emerald',
    capacity: 15,
    notes: 'حقائب وشنط جلدية وكروس بودي',
    createdAt: '2025-01-04T00:00:00.000Z',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'VIN-101',
    title: 'جاكيت جلد Vintage بني أصلي',
    brand: 'Zara',
    category: 'clothing',
    size: 'L',
    color: 'بني داكن',
    condition: 'very_good',
    storageLocation: 'صندوق A1',
    notes: 'جلد طبيعي ناعم، تم تنظيفه ومعالجته، جاهز للتصوير.',
    purchasePrice: 12,
    purchaseDate: '2025-02-10',
    sourceLocation: 'سوق السبت للمستعمل',
    targetPrice: 45,
    targetPlatform: 'vinted',
    status: 'in_storage',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80'],
    createdAt: '2025-02-10T10:00:00.000Z',
    updatedAt: '2025-02-10T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    sku: 'VIN-102',
    title: 'حذاء سنيكرز Air Force 1 أبيض',
    brand: 'Nike',
    category: 'shoes',
    size: '42 EU',
    color: 'أبيض',
    condition: 'good',
    storageLocation: 'صندوق B2',
    notes: 'تم تنظيف النعل بعناية، نعل أصلي بحالة ممتازة.',
    purchasePrice: 18,
    purchaseDate: '2025-02-14',
    sourceLocation: 'متجر التخفيضات',
    targetPrice: 55,
    targetPlatform: 'vinted',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80'],
    createdAt: '2025-02-14T11:30:00.000Z',
    updatedAt: '2025-02-14T11:30:00.000Z',
  },
  {
    id: 'prod-3',
    sku: 'VIN-103',
    title: 'قميص كتان بيج كلاسيكي',
    brand: 'Massimo Dutti',
    category: 'clothing',
    size: 'M',
    color: 'بيج',
    condition: 'new_with_tag',
    storageLocation: 'شماعة الملابس 1',
    notes: 'جديد مع التيكيت الأصلي، جودة عالية جداً.',
    purchasePrice: 8,
    purchaseDate: '2025-02-18',
    sourceLocation: 'أوتلت التخفيضات',
    targetPrice: 28,
    targetPlatform: 'vinted',
    status: 'in_storage',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80'],
    createdAt: '2025-02-18T14:15:00.000Z',
    updatedAt: '2025-02-18T14:15:00.000Z',
  },
  {
    id: 'prod-4',
    sku: 'VIN-104',
    title: 'حقيبة كتف جلد سوداء كروس بودي',
    brand: 'Michael Kors',
    category: 'bags',
    size: 'صغيرة',
    color: 'أسود',
    condition: 'very_good',
    storageLocation: 'صندوق A1',
    notes: 'سحابات ذهبية بحالة ممتازة وبطانة نظيفة.',
    purchasePrice: 15,
    purchaseDate: '2025-01-20',
    sourceLocation: 'متجر فينتج',
    targetPrice: 60,
    targetPlatform: 'vinted',
    status: 'sold',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80'],
    saleDetails: {
      soldPrice: 58,
      saleDate: '2025-02-22',
      platform: 'vinted',
      platformFees: 0, // Vinted buyer pays fee
      shippingFees: 1.5, // Packaging box & paper
      netProfit: 41.5, // 58 - 15 - 1.5 = 41.5
      roiPercentage: 276.6,
      buyerName: 'سارة م.',
    },
    createdAt: '2025-01-20T09:00:00.000Z',
    updatedAt: '2025-02-22T16:00:00.000Z',
  },
  {
    id: 'prod-5',
    sku: 'VIN-105',
    title: 'بنطلون جينز كلاسيك 501 أزرق مريح',
    brand: "Levi's",
    category: 'clothing',
    size: 'W32 L30',
    color: 'أزرق كلاسيكي',
    condition: 'very_good',
    storageLocation: 'صندوق A2',
    notes: 'موديل vintage أصلي، قماش قطن 100% ثقيل.',
    purchasePrice: 10,
    purchaseDate: '2025-02-05',
    sourceLocation: 'سوق المستعمل',
    targetPrice: 38,
    targetPlatform: 'vinted',
    status: 'sold',
    images: ['https://images.unsplash.com/photo-1542272604-780c96856592?w=500&auto=format&fit=crop&q=80'],
    saleDetails: {
      soldPrice: 36,
      saleDate: '2025-02-25',
      platform: 'vinted',
      platformFees: 0,
      shippingFees: 1.0,
      netProfit: 25.0, // 36 - 10 - 1 = 25
      roiPercentage: 250.0,
      buyerName: 'أحمد ك.',
    },
    createdAt: '2025-02-05T12:00:00.000Z',
    updatedAt: '2025-02-25T18:00:00.000Z',
  },
  {
    id: 'prod-6',
    sku: 'VIN-106',
    title: 'نظارة شمسية كلاسيك بإطار ذهبي',
    brand: 'Ray-Ban',
    category: 'accessories',
    size: 'قياسي',
    color: 'ذهبي / عدسات خضراء',
    condition: 'very_good',
    storageLocation: 'الرف الأوسط',
    notes: 'مع الحافظة الأصلية وقطعة التنظيف.',
    purchasePrice: 14,
    purchaseDate: '2025-02-26',
    sourceLocation: 'سوق البرغوث',
    targetPrice: 48,
    targetPlatform: 'vinted',
    status: 'in_storage',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80'],
    createdAt: '2025-02-26T15:20:00.000Z',
    updatedAt: '2025-02-26T15:20:00.000Z',
  }
];

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PRODUCTS;
  } catch (err) {
    console.error('Error reading stored products:', err);
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

export function getStoredCurrency(): string {
  try {
    return localStorage.getItem(CURRENCY_KEY) || 'EUR';
  } catch {
    return 'EUR';
  }
}

export function saveStoredCurrency(currencyCode: string): void {
  try {
    localStorage.setItem(CURRENCY_KEY, currencyCode);
  } catch (err) {
    console.error('Error saving currency:', err);
  }
}

export function getStoredBoxes(): StorageBox[] {
  try {
    const raw = localStorage.getItem(STORAGE_BOXES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_BOXES_KEY, JSON.stringify(DEFAULT_STORAGE_BOXES));
      return DEFAULT_STORAGE_BOXES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_STORAGE_BOXES;
  } catch (err) {
    console.error('Error reading stored boxes:', err);
    return DEFAULT_STORAGE_BOXES;
  }
}

export function saveStoredBoxes(boxes: StorageBox[]): void {
  try {
    localStorage.setItem(STORAGE_BOXES_KEY, JSON.stringify(boxes));
  } catch (err) {
    console.error('Error saving storage boxes:', err);
  }
}

export function generateNextSku(products: Product[]): string {
  let highest = 0;
  let hasAnySku = false;
  for (const p of products) {
    if (p.sku) {
      const cleaned = p.sku.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E\u00A0\r\n\t]/g, '').trim();
      const match = cleaned.match(/^([a-zA-Z_-]*?)0*(\d+)$/);
      if (match) {
        const num = parseInt(match[2], 10);
        if (!isNaN(num)) {
          hasAnySku = true;
          if (num > highest) {
            highest = num;
          }
        }
      }
    }
  }
  if (!hasAnySku || highest === 0) {
    return 'VIN-1';
  }
  return `VIN-${highest + 1}`;
}

export function calculateStats(products: Product[]): ResellerStats {
  let totalInventoryCost = 0;
  let totalExpectedRevenue = 0;
  let inStorageCount = 0;
  let listedCount = 0;

  let totalSoldRevenue = 0;
  let totalSoldCost = 0;
  let totalNetProfit = 0;
  let soldCount = 0;
  let totalROI = 0;

  for (const p of products) {
    if (p.status === 'in_storage' || p.status === 'listed') {
      totalInventoryCost += Number(p.purchasePrice) || 0;
      totalExpectedRevenue += Number(p.targetPrice) || 0;
      if (p.status === 'in_storage') inStorageCount++;
      if (p.status === 'listed') listedCount++;
    } else if (p.status === 'sold' && p.saleDetails) {
      soldCount++;
      const soldPrice = Number(p.saleDetails.soldPrice) || 0;
      const cost = Number(p.purchasePrice) || 0;
      const netProfit = Number(p.saleDetails.netProfit) || 0;
      
      totalSoldRevenue += soldPrice;
      totalSoldCost += cost;
      totalNetProfit += netProfit;
      
      const roi = cost > 0 ? (netProfit / cost) * 100 : 0;
      totalROI += roi;
    }
  }

  const totalPotentialProfit = Math.max(0, totalExpectedRevenue - totalInventoryCost);
  const averageProfitPerItem = soldCount > 0 ? totalNetProfit / soldCount : 0;
  const averageROI = soldCount > 0 ? totalROI / soldCount : 0;

  return {
    totalInventoryCost,
    totalExpectedRevenue,
    totalPotentialProfit,
    inStorageCount,
    listedCount,
    totalSoldRevenue,
    totalSoldCost,
    totalNetProfit,
    soldCount,
    averageProfitPerItem,
    averageROI,
  };
}

export function exportProductsJSON(products: Product[]) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `makhzooni-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportProductsCSV(products: Product[]) {
  const headers = [
    'SKU',
    'العنوان',
    'الماركة',
    'القسم',
    'المقاس',
    'اللون',
    'الحالة',
    'موقع التخزين',
    'سعر الشراء',
    'تاريخ الشراء',
    'سعر البيع المستهدف',
    'المنصة',
    'حالة المنتج',
    'سعر البيع الفعلي',
    'تاريخ البيع',
    'صافي الربح',
  ];

  const rows = products.map((p) => [
    p.sku,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.brand || '').replace(/"/g, '""')}"`,
    p.category,
    p.size || '',
    p.color || '',
    p.condition,
    `"${(p.storageLocation || '').replace(/"/g, '""')}"`,
    p.purchasePrice,
    p.purchaseDate || '',
    p.targetPrice,
    p.targetPlatform,
    p.status,
    p.saleDetails?.soldPrice ?? '',
    p.saleDetails?.saleDate ?? '',
    p.saleDetails?.netProfit ?? '',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `makhzooni-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
