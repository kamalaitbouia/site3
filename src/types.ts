export type ProductStatus = 'in_storage' | 'listed' | 'sold' | 'shipped' | 'archived';

export type Category = 
  | 'clothing' 
  | 'shoes' 
  | 'bags' 
  | 'accessories' 
  | 'electronics' 
  | 'home' 
  | 'beauty' 
  | 'other';

export type Condition = 
  | 'new_with_tag' 
  | 'new_no_tag' 
  | 'very_good' 
  | 'good' 
  | 'satisfactory';

export type SellingPlatform = 'vinted' | 'ebay' | 'depop' | 'marketplace' | 'vestiaire' | 'other';

export interface SaleDetails {
  soldPrice: number;
  saleDate: string;
  platform: SellingPlatform;
  platformFees: number;
  shippingFees: number; // shipping or packaging cost paid by seller
  netProfit: number;
  roiPercentage: number;
  buyerName?: string;
}

export interface Product {
  id: string;
  sku: string; // e.g., VIN-001
  title: string;
  brand: string;
  category: Category;
  size?: string;
  color?: string;
  condition: Condition;
  
  // Storage organization
  storageLocation: string; // e.g., "صندوق A1", "الرف العلوي", "Bin 04"
  notes?: string;

  // Pricing & sourcing
  purchasePrice: number;
  purchaseDate: string;
  sourceLocation?: string; // e.g., سوق المستعمل، متجر بالة، تخفيضات
  targetPrice: number; // Planned listing price
  targetPlatform: SellingPlatform;

  // Status & Sale
  status: ProductStatus;
  images: string[]; // URLs or base64 data
  
  // Sale info (when sold)
  saleDetails?: SaleDetails;

  createdAt: string;
  updatedAt: string;
}

export interface Currency {
  code: string;
  symbol: string;
  nameAr: string;
}

export interface StorageBox {
  id: string;
  name: string; // e.g. "صندوق A1", "الرف 1"
  zone?: string; // e.g. "غرفة المخزن", "الرف العلوي", "المرآب"
  color?: string; // e.g. 'amber', 'teal', 'indigo', 'emerald', 'rose', 'blue', 'purple', 'slate'
  capacity?: number; // max capacity (number of items)
  notes?: string;
  createdAt: string;
}

export interface ResellerStats {
  totalInventoryCost: number; // رأس المال المجمد في المخزن
  totalExpectedRevenue: number; // القيمة المتوقعة للمخزون
  totalPotentialProfit: number; // الأرباح المتوقعة
  inStorageCount: number; // عدد المنتجات في المخزن
  listedCount: number; // عدد المنتجات المعروضة
  
  totalSoldRevenue: number; // إجمالي مبيعات القطع المباعة
  totalSoldCost: number; // تكلفة شراء القطع المباعة
  totalNetProfit: number; // إجمالي الأرباح الصافية
  soldCount: number; // عدد القطع المباعة
  averageProfitPerItem: number; // متوسط الربح لكل قطعة
  averageROI: number; // متوسط العائد على الاستثمار %
}
