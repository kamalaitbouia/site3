import React, { useState, useEffect, useMemo } from 'react';
import { 
  Archive, 
  ArrowUpDown, 
  Package, 
  Plus, 
  ScanLine,
  Search, 
  X 
} from 'lucide-react';
import { Product, Currency, Category, SaleDetails, StorageBox } from './types';
import { CURRENCIES, CATEGORIES } from './lib/constants';
import { 
  getStoredCurrency, 
  saveStoredCurrency, 
  calculateStats, 
  generateNextSku, 
  INITIAL_PRODUCTS 
} from './lib/storage';
import { useInventory } from './hooks/useInventory';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StatsCards } from './components/StatsCards';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProductModal } from './components/ProductModal';
import { SellModal } from './components/SellModal';
import { PrintLabelsModal } from './components/PrintLabelsModal';
import { ExportImportModal } from './components/ExportImportModal';
import { StorageLocationsView } from './components/StorageLocationsView';
import { StorageBoxModal } from './components/StorageBoxModal';
import { ProfitAnalytics } from './components/ProfitAnalytics';
import { OfflineIndicator } from './components/OfflineIndicator';
import { VintedListingModal } from './components/VintedListingModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { PinAuthModal } from './components/PinAuthModal';
import { useI18n } from './lib/i18n';

export default function App() {
  const { t, lang, getCategoryName } = useI18n();

  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('makhzooni_app_unlocked') === 'true';
  });

  const handleUnlock = () => {
    localStorage.setItem('makhzooni_app_unlocked', 'true');
    setIsUnlocked(true);
  };

  const { products, setProducts, storageBoxes, setStorageBoxes, isLoading } = useInventory();
  
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    const code = getStoredCurrency();
    return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
  });
  
  const [currentTab, setCurrentTab] = useState<'inventory' | 'storage' | 'analytics'>('inventory');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_storage' | 'listed' | 'sold'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [storageFilter, setStorageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'cost_high' | 'target_high' | 'profit_high'>('newest');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [initialLocationForNewProduct, setInitialLocationForNewProduct] = useState<string | undefined>();

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [productToSell, setProductToSell] = useState<Product | null>(null);

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [productForLabel, setProductForLabel] = useState<Product | null>(null);

  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [productForListing, setProductForListing] = useState<Product | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  // Storage Box Modal state
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [boxToEdit, setBoxToEdit] = useState<StorageBox | null>(null);

  // Dedicated Product Details Modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [productForDetails, setProductForDetails] = useState<Product | null>(null);

  // Keep state in sync if modified in another window / tab (offline mode)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'makhzooni_products_v1') {
        // We only want this to run if not logged in, but useInventory doesn't expose that easily.
        // It's fine to keep it, but we can't easily re-fetch. Let's just remove it for simplicity.
      }
    };
  }, []);

  const handleSelectCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    saveStoredCurrency(currency.code);
  };

  // Derived statistics
  const stats = useMemo(() => calculateStats(products), [products]);

  // Unique storage locations for autocomplete & filters
  const existingLocations = useMemo(() => {
    const definedNames = storageBoxes.map((b) => b.name?.trim()).filter(Boolean);
    const productNames = products.map((p) => p.storageLocation?.trim()).filter(Boolean);
    return Array.from(new Set([...definedNames, ...productNames]));
  }, [storageBoxes, products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'in_storage' && p.status !== 'in_storage') return false;
          if (statusFilter === 'listed' && p.status !== 'listed') return false;
          if (statusFilter === 'sold' && p.status !== 'sold') return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && p.category !== categoryFilter) {
          return false;
        }

        // Storage Location filter
        if (storageFilter !== 'all' && p.storageLocation !== storageFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchLocation = p.storageLocation?.toLowerCase().includes(q);
          const matchNotes = p.notes?.toLowerCase().includes(q);
          if (!matchSku && !matchTitle && !matchBrand && !matchLocation && !matchNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'cost_high') {
          return (b.purchasePrice || 0) - (a.purchasePrice || 0);
        }
        if (sortBy === 'target_high') {
          return (b.targetPrice || 0) - (a.targetPrice || 0);
        }
        if (sortBy === 'profit_high') {
          const profitA = (a.targetPrice || 0) - (a.purchasePrice || 0);
          const profitB = (b.targetPrice || 0) - (b.purchasePrice || 0);
          return profitB - profitA;
        }
        return 0;
      });
  }, [products, statusFilter, categoryFilter, storageFilter, searchQuery, sortBy]);

  // Handlers
  const handleOpenAdd = (defaultLocation?: string, initialSku?: string) => {
    if (initialSku || defaultLocation) {
      setProductToEdit({
        sku: initialSku || '',
        storageLocation: defaultLocation || '',
      } as Partial<Product> as Product);
    } else {
      setProductToEdit(null);
    }
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (product: Product) => {
    const newSku = generateNextSku(products);
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      sku: newSku,
      title: `${product.title} (${lang === 'fr' ? 'Copie' : 'نسخة'})`,
      status: 'in_storage',
      saleDetails: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveProduct = (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString();
    if (data.id) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? {
                ...p,
                ...data,
                updatedAt: now,
              }
            : p
        )
      );
    } else {
      // Create new
      const newProduct: Product = {
        ...data,
        id: `prod-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Toggle status between in_storage and listed
  const handleToggleStatus = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== product.id) return p;
        if (p.status === 'sold') {
          return { ...p, status: 'in_storage', saleDetails: undefined };
        }
        const nextStatus = p.status === 'in_storage' ? 'listed' : 'in_storage';
        return { ...p, status: nextStatus };
      })
    );
  };

  // Trigger Sell Modal
  const handleMarkAsSold = (product: Product) => {
    setProductToSell(product);
    setIsSellModalOpen(true);
  };

  // Confirm Sale
  const handleConfirmSale = (productId: string, saleDetails: SaleDetails) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              status: 'sold',
              saleDetails,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  // Trigger Print Label
  const handlePrintLabel = (product: Product) => {
    setProductForLabel(product);
    setIsLabelModalOpen(true);
  };

  // Open Full Product Details Modal
  const handleOpenDetails = (product: Product) => {
    setProductForDetails(product);
    setIsDetailsModalOpen(true);
  };

  // Quick Location Update from Scanner
  const handleUpdateProductLocation = (productId: string, newLocation: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              storageLocation: newLocation,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    if (productForDetails && productForDetails.id === productId) {
      setProductForDetails((prev) => prev ? { ...prev, storageLocation: newLocation } : null);
    }
  };

  // Quick Status Update from Scanner
  const handleUpdateProductStatus = (productId: string, newStatus: Product['status']) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    if (productForDetails && productForDetails.id === productId) {
      setProductForDetails((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Trigger Vinted Listing Generator
  const handleGenerateListing = (product: Product) => {
    setProductForListing(product);
    setIsListingModalOpen(true);
  };

  // Reset to initial sample data
  const handleResetSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  // Import products from uploaded JSON
  const handleImportProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Jump from Storage Box view to Inventory filtered by that box
  const handleSelectLocationFromStorageView = (location: string) => {
    setStorageFilter(location);
    setCurrentTab('inventory');
  };

  // Storage Box Management
  const handleSaveBox = (box: StorageBox, updateLinkedProducts: boolean, oldName?: string) => {
    let nextBoxes: StorageBox[];
    const exists = storageBoxes.some((b) => b.id === box.id);
    if (exists) {
      nextBoxes = storageBoxes.map((b) => (b.id === box.id ? box : b));
    } else {
      nextBoxes = [...storageBoxes, box];
    }
    setStorageBoxes(nextBoxes);
    saveStoredBoxes(nextBoxes);

    // If renamed and user wanted to update linked products:
    if (updateLinkedProducts && oldName && oldName.trim().toLowerCase() !== box.name.trim().toLowerCase()) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.storageLocation?.trim().toLowerCase() === oldName.trim().toLowerCase()) {
            return { ...p, storageLocation: box.name, updatedAt: new Date().toISOString() };
          }
          return p;
        })
      );
    }
  };

  const handleDeleteBox = (boxId: string, boxName: string) => {
    const nextBoxes = storageBoxes.filter((b) => b.id !== boxId);
    setStorageBoxes(nextBoxes);
    saveStoredBoxes(nextBoxes);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 md:pb-12 flex flex-col selection:bg-teal-500 selection:text-white">
      { !isUnlocked && <PinAuthModal onUnlock={handleUnlock} /> }

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => handleOpenAdd()}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenScanner={() => setIsScannerModalOpen(true)}
        currentCurrency={currentCurrency}
        onSelectCurrency={handleSelectCurrency}
        inStockCount={stats.inStorageCount + stats.listedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: Inventory & Products View */}
        {currentTab === 'inventory' && (
          <div className="space-y-6">
            {/* Top Financial & Inventory Summary Cards */}
            <StatsCards
              stats={stats}
              currency={currentCurrency}
              onFilterStatus={(status) => setStatusFilter(status as any)}
              activeStatusFilter={statusFilter}
            />

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-3">
              {/* Search and Sort Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white transition`}
                  />
                  <Search className={`w-4 h-4 text-slate-400 absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-3`} />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600 cursor-pointer`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Actions: Add Product, Scan Barcode, Sort */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Add Product Button */}
                  <button
                    id="inventory-add-product-btn"
                    onClick={() => handleOpenAdd()}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs hover:shadow transition shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.navAddProduct}</span>
                  </button>

                  <button
                    id="filter-bar-scan-btn"
                    onClick={() => setIsScannerModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 text-xs font-bold transition shrink-0 cursor-pointer"
                    title={t.scannerModalTitle}
                  >
                    <ScanLine className="w-4 h-4 text-teal-600" />
                    <span>{t.btnScanBarcode}</span>
                  </button>

                  <div className="relative flex items-center">
                    <ArrowUpDown className={`w-3.5 h-3.5 text-slate-400 absolute ${lang === 'ar' ? 'right-3' : 'left-3'} pointer-events-none`} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={`text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl ${lang === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-2.5 text-slate-700 focus:outline-hidden cursor-pointer`}
                    >
                      <option value="newest">{t.sortNewest}</option>
                      <option value="oldest">{t.sortOldest}</option>
                      <option value="target_high">{t.sortTargetHigh}</option>
                      <option value="cost_high">{t.sortCostHigh}</option>
                      <option value="profit_high">{t.sortProfitHigh}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status and Category Chips Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.filterAll} ({products.length})
                  </button>

                  <button
                    onClick={() => setStatusFilter('in_storage')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      statusFilter === 'in_storage'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    {t.filterInStorage} ({stats.inStorageCount})
                  </button>

                  <button
                    onClick={() => setStatusFilter('listed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      statusFilter === 'listed'
                        ? 'bg-teal-600 text-white'
                        : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    {t.filterListed} ({stats.listedCount})
                  </button>

                  <button
                    onClick={() => setStatusFilter('sold')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      statusFilter === 'sold'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {t.filterSold} ({stats.soldCount})
                  </button>
                </div>

                {/* Category & Storage Location Dropdowns */}
                <div className="flex items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs bg-slate-100 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-xl focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">{t.filterAllCategories}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {getCategoryName(c.id)}
                      </option>
                    ))}
                  </select>

                  {storageFilter !== 'all' ? (
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl text-xs font-bold border border-amber-300">
                      <Archive className="w-3 h-3" />
                      <span>{storageFilter}</span>
                      <button
                        onClick={() => setStorageFilter('all')}
                        className="p-0.5 hover:bg-amber-200 rounded-full cursor-pointer"
                        title={t.clearFilters}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={storageFilter}
                      onChange={(e) => setStorageFilter(e.target.value)}
                      className="text-xs bg-slate-100 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-xl focus:outline-hidden cursor-pointer"
                    >
                      <option value="all">{t.filterAllLocations}</option>
                      {existingLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          📦 {loc}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Products Count Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                {t.showingItems.replace('{count}', filteredProducts.length.toString()).replace('{total}', products.length.toString())}
              </span>
              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || storageFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setStorageFilter('all');
                  }}
                  className="text-teal-700 hover:text-teal-800 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.clearFilters}</span>
                </button>
              )}
            </div>

            {/* Products Grid - Clean, Compact & Square Visual Cards */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currentCurrency}
                    onClick={handleOpenDetails}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-100">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                  {t.noProductsFound}
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  {t.noProductsFoundDesc}
                </p>
                <button
                  onClick={() => handleOpenAdd()}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addNewProduct}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Storage Bins & Locations Organizer */}
        {currentTab === 'storage' && (
          <StorageLocationsView
            products={products}
            currency={currentCurrency}
            storageBoxes={storageBoxes}
            onSelectLocationFilter={handleSelectLocationFromStorageView}
            onAddNewProductToLocation={(loc) => {
              setInitialLocationForNewProduct(loc);
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onOpenAddBoxModal={() => {
              setBoxToEdit(null);
              setIsBoxModalOpen(true);
            }}
            onOpenEditBoxModal={(box) => {
              setBoxToEdit(box);
              setIsBoxModalOpen(true);
            }}
            onDeleteBox={handleDeleteBox}
          />
        )}

        {/* TAB 3: Profit & Performance Analytics */}
        {currentTab === 'analytics' && (
          <ProfitAnalytics
            products={products}
            stats={stats}
            currency={currentCurrency}
            onViewProduct={handleEditProduct}
          />
        )}
      </main>

      {/* Floating Action Button on Mobile */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => handleOpenAdd()}
        onOpenScanner={() => setIsScannerModalOpen(true)}
        inStockCount={stats.inStorageCount + stats.listedCount}
      />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setInitialLocationForNewProduct(undefined);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        suggestedSku={generateNextSku(products)}
        currency={currentCurrency}
        existingLocations={existingLocations}
        initialLocation={initialLocationForNewProduct}
      />

      {/* Product Details & Actions Popup Modal */}
      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        product={productForDetails}
        currency={currentCurrency}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={(prod) => {
          setIsDetailsModalOpen(false);
          handleEditProduct(prod);
        }}
        onDuplicate={(prod) => {
          setIsDetailsModalOpen(false);
          handleDuplicateProduct(prod);
        }}
        onDelete={(id) => {
          setIsDetailsModalOpen(false);
          handleDeleteProduct(id);
        }}
        onMarkAsSold={(prod) => {
          setIsDetailsModalOpen(false);
          handleMarkAsSold(prod);
        }}
        onToggleStatus={(prod) => {
          handleToggleStatus(prod);
          setProductForDetails((prev) => prev && prev.id === prod.id ? {
            ...prev,
            status: prev.status === 'listed' ? 'in_storage' : 'listed'
          } : null);
        }}
        onPrintLabel={(prod) => {
          setIsDetailsModalOpen(false);
          handlePrintLabel(prod);
        }}
        onGenerateListing={(prod) => {
          setIsDetailsModalOpen(false);
          handleGenerateListing(prod);
        }}
        onUpdateLocation={handleUpdateProductLocation}
      />

      {/* Quick Sell Modal */}
      <SellModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        product={productToSell}
        currency={currentCurrency}
        onConfirmSale={handleConfirmSale}
      />

      {/* Print Inventory Tag Modal */}
      <PrintLabelsModal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        product={productForLabel}
        currency={currentCurrency}
      />

      {/* Vinted Listing Generator Modal */}
      <VintedListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        product={productForListing}
      />

      {/* Barcode Scanner & SKU Finder Modal (Feature 2) */}
      <BarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        products={products}
        currency={currentCurrency}
        onSelectProductToSell={handleMarkAsSold}
        onSelectProductForLabel={handlePrintLabel}
        onSelectProductForListing={handleGenerateListing}
        onUpdateProductLocation={handleUpdateProductLocation}
        onUpdateProductStatus={handleUpdateProductStatus}
        allLocations={existingLocations}
        onAddNewWithSku={(sku) => {
          setIsScannerModalOpen(false);
          handleOpenAdd(undefined, sku);
        }}
      />

      {/* Storage Box Add / Edit Modal */}
      <StorageBoxModal
        isOpen={isBoxModalOpen}
        onClose={() => {
          setIsBoxModalOpen(false);
          setBoxToEdit(null);
        }}
        onSave={handleSaveBox}
        onDelete={handleDeleteBox}
        boxToEdit={boxToEdit}
        itemsCountInBox={
          boxToEdit
            ? products.filter(
                (p) =>
                  (p.storageLocation?.trim().toLowerCase() === boxToEdit.name.toLowerCase()) &&
                  (p.status === 'in_storage' || p.status === 'listed')
              ).length
            : 0
        }
        existingBoxes={storageBoxes}
      />

      {/* Export / Backup Modal */}
      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        products={products}
        onImportProducts={handleImportProducts}
        onResetSampleData={handleResetSampleData}
      />
    </div>
  );
}
