import { Product, ResellerStats, SaleDetails, StorageBox } from '../types';

const STORAGE_KEY = 'makhzooni_products_v2';
const CURRENCY_KEY = 'makhzooni_currency_v1';
const STORAGE_BOXES_KEY = 'makhzooni_storage_boxes_v3';

export const DEFAULT_STORAGE_BOXES: StorageBox[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

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
  // Short Hash - Amazon Style (5 characters)
  // Exclude confusing characters: 0, O, 1, I, L
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const length = 5;
  let newSku = '';
  let isUnique = false;

  while (!isUnique) {
    newSku = '';
    for (let i = 0; i < length; i++) {
      newSku += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if this SKU already exists in the inventory
    const exists = products.some(p => p.sku === newSku);
    if (!exists) {
      isUnique = true;
    }
  }

  return newSku;
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
