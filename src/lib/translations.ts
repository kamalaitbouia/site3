export type Language = 'ar' | 'fr';

export interface Translations {
  appName: string;
  appBadge: string;
  appDescription: string;
  
  // Navigation
  navInventory: string;
  navStorage: string;
  navAnalytics: string;
  navAddProduct: string;
  navBackup: string;
  
  // Mobile Nav
  mobileInventory: string;
  mobileStorage: string;
  mobileAnalytics: string;
  mobileAdd: string;

  // Language & Currency
  languageLabel: string;
  currencyLabel: string;

  // Stats
  statNetProfit: string;
  statItemsSold: string;
  statCapitalStorage: string;
  statCapitalStorageDesc: string;
  statReadyInStorage: string;
  statPotentialProfit: string;
  statPotentialRevenue: string;
  statTotalItems: string;
  statSalesRate: string;
  statRoi: string;

  // Filters & Search
  searchPlaceholder: string;
  filterAll: string;
  filterInStorage: string;
  filterListed: string;
  filterSold: string;
  filterAllCategories: string;
  filterAllLocations: string;
  sortBy: string;
  sortNewest: string;
  sortOldest: string;
  sortCostHigh: string;
  sortTargetHigh: string;
  sortProfitHigh: string;
  clearFilters: string;
  showingItems: string;
  noProductsFound: string;
  noProductsFoundDesc: string;
  addNewProduct: string;

  // Product Card
  cardPurchasePrice: string;
  cardTargetPrice: string;
  cardEstimatedProfit: string;
  cardNetProfit: string;
  cardLocation: string;
  cardNoImage: string;
  cardSoldOn: string;
  btnGenerateVinted: string;
  btnRecordSale: string;
  btnReturnToStorage: string;
  btnMarkListed: string;
  btnMarkInStorage: string;
  btnEdit: string;
  btnPrintLabel: string;
  btnDuplicate: string;
  btnDelete: string;
  confirmDelete: string;

  // Product Modal (Add / Edit)
  modalAddTitle: string;
  modalEditTitle: string;
  modalAddSubtitle: string;
  skuLabel: string;
  skuAuto: string;
  titleLabel: string;
  titlePlaceholder: string;
  brandLabel: string;
  brandPlaceholder: string;
  categoryLabel: string;
  sizeLabel: string;
  sizePlaceholder: string;
  colorLabel: string;
  colorPlaceholder: string;
  conditionLabel: string;
  storageLocationLabel: string;
  storageLocationPlaceholder: string;
  storageSuggestions: string;
  purchasePriceLabel: string;
  targetPriceLabel: string;
  purchaseDateLabel: string;
  sourceLocationLabel: string;
  sourceLocationPlaceholder: string;
  targetPlatformLabel: string;
  statusLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  imagesLabel: string;
  imagesHint: string;
  imageUrlPlaceholder: string;
  btnCancel: string;
  btnSave: string;
  btnSaving: string;

  // Sell Modal
  sellModalTitle: string;
  sellModalSubtitle: string;
  soldPriceLabel: string;
  saleDateLabel: string;
  sellingPlatformLabel: string;
  vintedZeroFeeNote: string;
  customerNameLabel: string;
  customerNamePlaceholder: string;
  platformFeesLabel: string;
  shippingFeesLabel: string;
  shippingFeesHint: string;
  netProfitCalculation: string;
  netProfitLabel: string;
  roiLabel: string;
  marginLabel: string;
  btnConfirmSale: string;

  // Print Label Modal
  printModalTitle: string;
  printInstructions: string;
  printTargetPrice: string;
  btnPrintNow: string;
  btnClose: string;

  // Vinted Listing Modal
  vintedModalTitle: string;
  vintedModalSubtitle: string;
  listingLangLabel: string;
  langFrench: string;
  langFrenchRecommended: string;
  langEnglish: string;
  langArabic: string;
  vintedTitleLabel: string;
  vintedDescLabel: string;
  btnCopyTitleOnly: string;
  btnCopyDescOnly: string;
  btnCopyAll: string;
  copiedSuccess: string;
  copiedTitleSuccess: string;
  copiedDescSuccess: string;
  vintedModalTip: string;

  // Storage Locations View
  storageViewTitle: string;
  storageViewSubtitle: string;
  searchLocationsPlaceholder: string;
  totalLocationsCount: string;
  activeItemsInBox: string;
  itemsSoldFromBox: string;
  costInBox: string;
  potentialValueInBox: string;
  recentItemsInBox: string;
  btnViewBoxItems: string;
  btnAddItemToBox: string;
  noLocationsFound: string;
  noLocationsFoundDesc: string;

  // Analytics View
  analyticsTitle: string;
  analyticsSubtitle: string;
  totalRevenue: string;
  totalCostSold: string;
  avgProfitPerItem: string;
  salesByPlatform: string;
  salesByCategory: string;
  monthlyPerformance: string;
  inventoryBreakdown: string;

  // Backup Modal
  backupModalTitle: string;
  backupModalSubtitle: string;
  exportCsvTitle: string;
  exportCsvDesc: string;
  btnExportCsv: string;
  exportJsonTitle: string;
  exportJsonDesc: string;
  btnExportJson: string;
  importJsonTitle: string;
  importJsonDesc: string;
  btnImportJson: string;
  resetSampleDataTitle: string;
  resetSampleDataDesc: string;
  btnResetSampleData: string;

  // Offline
  offlineBanner: string;
  onlineBanner: string;

  // Shared / Common UI
  cancel: string;
  close: string;
  brand: string;
  unspecified: string;
  storageLocation: string;
  recommended: string;

  // Additional Profit Analytics
  financialPerformanceTitle: string;
  totalNetProfitsBanner: string;
  successfulSalesBadge: string;
  revenueTotal: string;
  cogsTotal: string;
  grossMargin: string;
  topBrandsTitle: string;
  byNetProfit: string;
  itemsCount: string;
  notEnoughSalesBrands: string;
  topCategoriesTitle: string;
  bySales: string;
  salesCount: string;
  noSalesInCategories: string;
  salesHistoryTitle: string;
  completedSales: string;
  tableProductSku: string;
  tableSaleDate: string;
  tablePlatform: string;
  tableCostPrice: string;
  tableSoldPrice: string;
  tableFeesShipping: string;
  tableNetProfit: string;
  tableRoi: string;
  noSalesRecordedYet: string;
  otherBrand: string;

  // Sell Modal additions
  successfulSaleTitle: string;
  successfulSaleDesc: string;
  origPurchaseCost: string;
  finalSoldPrice: string;
  saleDate: string;
  vintedZeroSellerFees: string;
  buyerNameOptional: string;
  platformCommission: string;
  packagingShippingCost: string;
  realNetProfitThisItem: string;
  netMarginLabel: string;
  calculationFormula: string;
  confirmSaleBtn: string;

  // Storage Locations View additions
  unspecifiedBox: string;
  storageLocationsTitle: string;
  storageLocationsDesc: string;
  searchLocationPlaceholder: string;
  itemsInStock: string;
  soldItemsCount: string;
  itemsInBox: string;
  potentialValue: string;
  latestItemsInLocation: string;
  viewBoxItems: string;
  addToThisBox: string;
  noMatchingBoxes: string;
  noMatchingBoxesDesc: string;

  // Storage Boxes Management additions
  addStorageBoxBtn: string;
  newStorageBoxTitle: string;
  editStorageBoxTitle: string;
  boxNameLabel: string;
  boxNamePlaceholder: string;
  boxZoneLabel: string;
  boxZonePlaceholder: string;
  boxColorLabel: string;
  boxCapacityLabel: string;
  boxNotesLabel: string;
  boxNotesPlaceholder: string;
  saveBoxBtn: string;
  updateBoxBtn: string;
  deleteBoxBtn: string;
  deleteBoxConfirm: string;
  boxHasItemsWarning: string;
  updateLinkedProducts: string;
  emptyBoxBadge: string;
  emptyBoxDesc: string;
  filterAllBoxes: string;
  filterOccupiedBoxes: string;
  filterEmptyBoxes: string;
  totalBoxesCount: string;
  totalItemsInBoxes: string;
  totalCapitalInBoxes: string;
  potentialProfitInBoxes: string;
  printBoxLabelBtn: string;
  boxLabelSubtitle: string;
  boxCapacityFullness: string;
  boxFullWarning: string;

  // Vinted Generator additions
  vintedGeneratorTitle: string;
  vintedGeneratorDesc: string;
  adLanguage: string;
  frenchLang: string;
  englishLang: string;
  arabicLang: string;
  titleCopied: string;
  descCopied: string;
  fullAdCopied: string;
  copyFullAd: string;
  copyTitleOnly: string;
  copyDescOnly: string;
  vintedTip: string;

  // Print Label additions
  printLabelTitle: string;
  printLabelDesc: string;
  printNow: string;

  // Product Modal specific keys
  editProductTitle: string;
  addProductTitle: string;
  addProductDesc: string;
  productPhotosLabel: string;
  takePhoto: string;
  pasteImageUrl: string;
  addImageUrl: string;
  productSkuLabel: string;
  productTitleLabel: string;
  storageLocationDesc: string;
  pricingSectionTitle: string;
  purchasePriceModalLabel: string;
  targetPriceModalLabel: string;
  expectedNetProfitLabel: string;
  statusCurrentLabel: string;
  notesDefectsLabel: string;
  saveChanges: string;
  addToInventory: string;

  // Feature 2: Barcode Scanner & SKU Finder
  navScanner: string;
  btnScanBarcode: string;
  scannerModalTitle: string;
  scannerModalSubtitle: string;
  cameraScanning: string;
  cameraPermissionDenied: string;
  scanInstruction: string;
  manualSkuInput: string;
  quickTestSamples: string;
  itemFound: string;
  noItemFound: string;
  scanAnother: string;
  quickActions: string;
  changeBoxLocation: string;
  boxLocationUpdated: string;
  simulateScan: string;

  // Feature 2: Vinted Offer & Negotiation Calculator
  navOfferCalculator: string;
  offerCalculatorTitle: string;
  offerCalculatorSubtitle: string;
  originalTargetPrice: string;
  buyerOfferPrice: string;
  discountPercentage: string;
  calculatedProfitAtOffer: string;
  offerRecommendation: string;
  recommendAccept: string;
  recommendCounter: string;
  recommendReject: string;
  counterOfferSuggestion: string;
  openOfferCalculator: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ar: {
    appName: 'مخزون فينتد',
    appBadge: 'Vinted Pro',
    appDescription: 'إدارة المخزون، مواقع الصناديق، وحساب الأرباح الصافية',

    navInventory: 'المخزون والمنتجات',
    navStorage: 'أماكن وصناديق التخزين',
    navAnalytics: 'تقرير الأرباح',
    navAddProduct: 'إضافة منتج للمخزن',
    navBackup: 'النسخ الاحتياطي',

    mobileInventory: 'المخزون',
    mobileStorage: 'الصناديق',
    mobileAnalytics: 'الأرباح',
    mobileAdd: 'إضافة قطعة',

    languageLabel: 'اللغة',
    currencyLabel: 'العملة',

    statNetProfit: 'صافي الأرباح المحققة',
    statItemsSold: 'قطعة مباعة',
    statCapitalStorage: 'رأس المال في المخزن',
    statCapitalStorageDesc: 'تكلفة الشراء للبضاعة غير المباعة',
    statReadyInStorage: 'قطعة جاهزة',
    statPotentialProfit: 'أرباح المخزون المتوقعة',
    statPotentialRevenue: 'قيمة البيع المتوقعة',
    statTotalItems: 'إجمالي القطع في النظام',
    statSalesRate: 'نسبة المبيعات المنجزة',
    statRoi: 'عائد الاستثمار',

    searchPlaceholder: 'ابحث بالاسم، كود SKU، الماركة، أو الصندوق...',
    filterAll: 'الكل',
    filterInStorage: 'في المخزن',
    filterListed: 'معروض للبيع',
    filterSold: 'تم البيع',
    filterAllCategories: 'جميع التصنيفات',
    filterAllLocations: 'جميع أماكن التخزين',
    sortBy: 'الترتيب حسب',
    sortNewest: 'الأحدث إضافة',
    sortOldest: 'الأقدم إضافة',
    sortCostHigh: 'سعر الشراء: الأعلى',
    sortTargetHigh: 'سعر البيع: الأعلى',
    sortProfitHigh: 'الربح المتوقع: الأعلى',
    clearFilters: 'مسح الفلاتر',
    showingItems: 'عرض {count} من أصل {total} قطعة',
    noProductsFound: 'لم يتم العثور على أي قطع',
    noProductsFoundDesc: 'جرب تغيير شروط البحث أو الفلاتر، أو أضف منتجاً جديداً.',
    addNewProduct: 'إضافة منتج جديد',

    cardPurchasePrice: 'تكلفة الشراء',
    cardTargetPrice: 'البيع المستهدف',
    cardEstimatedProfit: 'الربح المتوقع',
    cardNetProfit: 'ربح',
    cardLocation: 'المكان',
    cardNoImage: 'بدون صورة',
    cardSoldOn: 'بيع عبر',
    btnGenerateVinted: 'توليد إعلان Vinted جاهز للنسخ',
    btnRecordSale: 'تسجيل بيع',
    btnReturnToStorage: 'إعادة للمخزن',
    btnMarkListed: 'عُرض بالمتجر',
    btnMarkInStorage: 'في المخزن',
    btnEdit: 'تعديل',
    btnPrintLabel: 'ملصق',
    btnDuplicate: 'نسخ',
    btnDelete: 'حذف',
    confirmDelete: 'هل أنت متأكد من حذف هذه القطعة نهائياً من المخزون؟',

    modalAddTitle: 'إضافة قطعة جديدة إلى المخزن',
    modalEditTitle: 'تعديل بيانات القطعة',
    modalAddSubtitle: 'سجل تفاصيل القطعة، كلفة الشراء، ومكان التخزين الدقيق لتجدها فور بيعها',
    skuLabel: 'رمز القطعة (SKU)',
    skuAuto: 'توليد تلقائي',
    titleLabel: 'اسم وعنوان القطعة *',
    titlePlaceholder: 'مثال: جاكيت جينز Vintage كلاسيكي أزرق',
    brandLabel: 'الماركة / البراند',
    brandPlaceholder: 'مثال: Zara, Nike, Ralph Lauren...',
    categoryLabel: 'التصنيف *',
    sizeLabel: 'المقاس',
    sizePlaceholder: 'مثال: M, 42 EU, 32W...',
    colorLabel: 'اللون',
    colorPlaceholder: 'مثال: أسود، أزرق كحلي، بني...',
    conditionLabel: 'حالة القطعة *',
    storageLocationLabel: 'مكان / صندوق التخزين *',
    storageLocationPlaceholder: 'مثال: صندوق A1، الرف 2، شماعة 1...',
    storageSuggestions: 'اقتراحات سريعة',
    purchasePriceLabel: 'تكلفة الشراء *',
    targetPriceLabel: 'سعر البيع المستهدف *',
    purchaseDateLabel: 'تاريخ الشراء',
    sourceLocationLabel: 'مصدر الشراء (السورسينغ)',
    sourceLocationPlaceholder: 'مثال: سوق المستعمل، متجر بالة، تخفيضات...',
    targetPlatformLabel: 'المنصة المستهدفة للبيع',
    statusLabel: 'حالة القطعة الحالية',
    notesLabel: 'ملاحظات أو عيوب (إن وجدت)',
    notesPlaceholder: 'مثال: زر مفقود، قماش ممتاز بدون بقع...',
    imagesLabel: 'صور القطعة',
    imagesHint: 'يمكنك رفع الصور من جهازك أو التقاطها مباشرة',
    imageUrlPlaceholder: 'أو الصق رابط صورة مباشر...',
    btnCancel: 'إلغاء',
    btnSave: 'حفظ وتأكيد',
    btnSaving: 'جاري الحفظ...',

    sellModalTitle: 'تسجيل عملية البيع وتأكيد الأرباح',
    sellModalSubtitle: 'احسب صافي الربح بدقة بعد خصم الرسوم وتكاليف الشحن والتغليف',
    soldPriceLabel: 'سعر البيع الفعلي المحقق *',
    saleDateLabel: 'تاريخ البيع *',
    sellingPlatformLabel: 'المنصة التي تم البيع عليها',
    vintedZeroFeeNote: '✓ في Vinted لا يدفع البائع أي عمولة بيع',
    customerNameLabel: 'اسم أو معرف المشتري (اختياري)',
    customerNamePlaceholder: 'مثال: Lucas_fr, Sarah92...',
    platformFeesLabel: 'عمولة ورسوم المنصة إن وجدت',
    shippingFeesLabel: 'مصاريف التغليف والشحن (التي دفعها البائع)',
    shippingFeesHint: 'كرتون، أكياس بريدية، لاصق، أو شحن خاص',
    netProfitCalculation: 'ملخص الحسبة المالية والأرباح',
    netProfitLabel: 'صافي الربح الحقيقي',
    roiLabel: 'عائد الاستثمار (ROI)',
    marginLabel: 'هامش الربح الصافي',
    btnConfirmSale: 'تأكيد البيع وحساب الربح',

    printModalTitle: 'ملصق المنتج والتخزين (Inventory Tag)',
    printInstructions: 'اطبع هذا الملصق وثبته على الكيس أو القطعة للوصول إليها في ثوانٍ عند الشحن:',
    printTargetPrice: 'سعر البيع المستهدف',
    btnPrintNow: 'طباعة الآن',
    btnClose: 'إغلاق',

    vintedModalTitle: 'مُولّد إعلان Vinted الجاهز',
    vintedModalSubtitle: 'صيغة إعلان جذابة ومنسقة تزيد المشاهدات والمبيعات مع هاشتاغات ذكية',
    listingLangLabel: 'لغة الإعلان:',
    langFrench: '🇫🇷 الفرنسية',
    langFrenchRecommended: '(موصى بها لـ Vinted)',
    langEnglish: '🇬🇧 الإنجليزية',
    langArabic: '🇸🇦 العربية',
    vintedTitleLabel: 'عنوان الإعلان (Vinted Title):',
    vintedDescLabel: 'نص الوصف والهاشتاغات (Vinted Description):',
    btnCopyTitleOnly: 'نسخ العنوان فقط',
    btnCopyDescOnly: 'نسخ الوصف فقط',
    btnCopyAll: 'نسخ الإعلان كاملاً',
    copiedSuccess: 'تم النسخ بنجاح! جاهز للصق على Vinted',
    copiedTitleSuccess: 'تم نسخ العنوان!',
    copiedDescSuccess: 'تم نسخ الوصف!',
    vintedModalTip: '💡 يمكنك تعديل وتخصيص أي نص أعلاه بحرية قبل نسخه ولصقه في Vinted.',

    storageViewTitle: 'أماكن وصناديق التخزين',
    storageViewSubtitle: 'تتبع مواقع القطع في منزلك أو مستودعك لمعرفة مكان كل قطعة فور طلبها',
    searchLocationsPlaceholder: 'بحث في الصناديق والأماكن...',
    totalLocationsCount: 'موقع تخزين مسجل',
    activeItemsInBox: 'قطعة جاهزة بالمخزن',
    itemsSoldFromBox: 'بيعت',
    costInBox: 'تكلفة البضاعة بالصندوق',
    potentialValueInBox: 'قيمة البيع المتوقعة',
    recentItemsInBox: 'أحدث القطع في هذا المكان:',
    btnViewBoxItems: 'عرض منتجات الصندوق',
    btnAddItemToBox: 'إضافة قطعة لهذا الصندوق',
    noLocationsFound: 'لا توجد صناديق مطابقة',
    noLocationsFoundDesc: 'قم بإضافة منتج وتحديد موقع التخزين الخاص به وسيظهر هنا تلقائياً.',

    analyticsTitle: 'لوحة تحليل الأرباح والتقارير المالية',
    analyticsSubtitle: 'رؤية شاملة لأداء مبيعاتك، المنتجات الأكثر ربحية، ومعدل دوران المخزون',
    totalRevenue: 'إجمالي المبيعات المحققة',
    totalCostSold: 'تكلفة شراء القطع المباعة',
    avgProfitPerItem: 'متوسط الربح للقطعة',
    salesByPlatform: 'توزيع المبيعات حسب المنصة',
    salesByCategory: 'الأرباح حسب تصنيف المنتجات',
    monthlyPerformance: 'الأداء المالي الشهري',
    inventoryBreakdown: 'توزيع رأس المال في المخزون',

    backupModalTitle: 'النسخ الاحتياطي وتصدير البيانات',
    backupModalSubtitle: 'حافظ على أمان بياناتك أو انقلها إلى إكسل لإجراء تحليلات إضافية',
    exportCsvTitle: 'تصدير كملف Excel / CSV',
    exportCsvDesc: 'قم بتنزيل جدول كامل بجميع المنتجات وتكاليفها ومواقع تخزينها وأرباحها.',
    btnExportCsv: 'تحميل ملف Excel (CSV)',
    exportJsonTitle: 'نسخة احتياطية كاملة (JSON Backup)',
    exportJsonDesc: 'حفظ نسخة أصلية من كل البيانات لإمكانية استرجاعها على أي جهاز آخر.',
    btnExportJson: 'تحميل النسخة الاحتياطية',
    importJsonTitle: 'استعادة نسخة احتياطية',
    importJsonDesc: 'رفع ملف نسخة سابقة تم تصديرها لإرجاع المنتجات والمخزون.',
    btnImportJson: 'استيراد ملف النسخة',
    resetSampleDataTitle: 'إعادة ضبط البيانات التجريبية',
    resetSampleDataDesc: 'تحميل بيانات تجريبية جاهزة لتجربة وظائف التطبيق بالكامل.',
    btnResetSampleData: 'تحميل عينات تجريبية',

    offlineBanner: 'أنت تعمل حالياً بدون اتصال بالإنترنت. التعديلات تحفظ محلياً على جهازك وستبقى آمنة.',
    onlineBanner: 'تمت استعادة الاتصال بالإنترنت بنجاح!',

    // Shared / Common UI
    cancel: 'إلغاء',
    close: 'إغلاق',
    brand: 'الماركة',
    unspecified: 'غير محدد',
    storageLocation: 'مكان التخزين',
    recommended: 'مستحسن',

    // Additional Profit Analytics
    financialPerformanceTitle: 'تحليل الأداء المالي الصافي للبائع',
    totalNetProfitsBanner: 'إجمالي الأرباح الصافية',
    successfulSalesBadge: 'عملية بيع ناجحة',
    revenueTotal: 'إجمالي المبيعات (Revenue)',
    cogsTotal: 'تكلفة البضاعة المباعة (COGS)',
    grossMargin: 'هامش الربح الإجمالي',
    topBrandsTitle: 'أكثر الماركات ربحية بالنسبة لك',
    byNetProfit: 'حسب صافي الربح',
    itemsCount: 'قطع',
    notEnoughSalesBrands: 'لم تسجل مبيعات كافية بعد لإظهار ترتيب الماركات',
    topCategoriesTitle: 'الأرباح حسب الفئات والأقسام',
    bySales: 'حسب المبيعات',
    salesCount: 'مبيعات',
    noSalesInCategories: 'لا توجد مبيعات مسجلة في الأقسام بعد',
    salesHistoryTitle: 'سجل المبيعات والأرباح الفردية',
    completedSales: 'عمليات بيع مكتملة',
    tableProductSku: 'المنتج والرمز',
    tableSaleDate: 'تاريخ البيع',
    tablePlatform: 'المنصة',
    tableCostPrice: 'سعر التكلفة',
    tableSoldPrice: 'سعر البيع',
    tableFeesShipping: 'الرسوم والشحن',
    tableNetProfit: 'صافي الربح',
    tableRoi: 'العائد (ROI)',
    noSalesRecordedYet: 'لم يتم تسجيل أي مبيعات بعد. عند بيع أي قطعة من المخزن ستظهر هنا بتفاصيل أرباحها الصافية!',
    otherBrand: 'ماركة أخرى',

    // Sell Modal additions
    successfulSaleTitle: 'تسجيل عملية بيع ناجحة',
    successfulSaleDesc: 'أدخل تفاصيل البيع لحساب الربح الصافي وتحديث حالة المخزون تلقائياً',
    origPurchaseCost: 'تكلفة الشراء الأصلية',
    finalSoldPrice: 'سعر البيع النهائي للقطعة',
    saleDate: 'تاريخ البيع',
    vintedZeroSellerFees: '💡 في Vinted لا توجد عمولة مقتطعة من البائع (0%)',
    buyerNameOptional: 'اسم المشتري (اختياري)',
    platformCommission: 'عمولة المنصة / البوابة',
    packagingShippingCost: 'تكاليف التغليف والشحن (التي دفعتها أنت)',
    realNetProfitThisItem: 'صافي الربح الحقيقي لهذه القطعة',
    netMarginLabel: 'هامش الربح الصافي',
    calculationFormula: 'الحسبة: سعر البيع - (سعر الشراء + عمولة المنصة + الشحن والتغليف)',
    confirmSaleBtn: 'تأكيد وحفظ البيع',

    // Storage Locations View additions
    unspecifiedBox: 'صندوق غير محدد',
    storageLocationsTitle: 'إدارة مواقع وصناديق التخزين',
    storageLocationsDesc: 'تتبع بالضبط في أي صندوق أو رف تتواجد كل قطعة لتسريع الشحن فور البيع',
    searchLocationPlaceholder: 'ابحث عن صندوق، رف، أو مكان تخزين...',
    itemsInStock: 'قطع في المخزن',
    soldItemsCount: 'مباعة',
    itemsInBox: 'قطع في الصندوق',
    potentialValue: 'القيمة المحتملة',
    latestItemsInLocation: 'آخر القطع المضافة هنا:',
    viewBoxItems: 'عرض كل قطع الصندوق',
    addToThisBox: 'إضافة قطعة لهذا الصندوق',
    noMatchingBoxes: 'لم يتم العثور على أي صندوق مطابق',
    noMatchingBoxesDesc: 'جرب البحث باسم آخر، أو حدد صندوقاً جديداً عند إضافة منتج للمخزن.',

    // Storage Boxes Management additions
    addStorageBoxBtn: 'إضافة صندوق / رف جديد',
    newStorageBoxTitle: 'إضافة صندوق أو رف تخزين جديد',
    editStorageBoxTitle: 'تعديل بيانات الصندوق أو الرف',
    boxNameLabel: 'اسم الصندوق أو الرف',
    boxNamePlaceholder: 'مثال: صندوق A4، رف الأحذية 2، شماعة 3...',
    boxZoneLabel: 'منطقة أو غرفة التخزين',
    boxZonePlaceholder: 'مثال: غرفة المخزن، الرف العلوي، المرآب...',
    boxColorLabel: 'لون التمييز البصري',
    boxCapacityLabel: 'السعة الاستيعابية القصوى (عدد القطع - اختياري)',
    boxNotesLabel: 'ملاحظات أو نوع البضاعة بالداخل',
    boxNotesPlaceholder: 'مثال: مخصص للسترات الشتوية، إكسسوارات، أحذية رياضية...',
    saveBoxBtn: 'حفظ الصندوق',
    updateBoxBtn: 'تحديث البيانات',
    deleteBoxBtn: 'حذف الصندوق',
    deleteBoxConfirm: 'هل أنت متأكد من رغبتك في حذف هذا الصندوق نهائياً؟',
    boxHasItemsWarning: 'تنبيه: هذا الصندوق يحتوي على قطع مخزنة! يرجى نقل القطع لصندوق آخر أو إعادة تسمية الصندوق.',
    updateLinkedProducts: 'تحديث موقع جميع المنتجات الموجودة في هذا الصندوق تلقائياً بالاسم الجديد',
    emptyBoxBadge: 'صندوق فارغ',
    emptyBoxDesc: 'جاهز لاستقبال بضاعة جديدة',
    filterAllBoxes: 'جميع الصناديق والأرفف',
    filterOccupiedBoxes: 'صناديق بها بضاعة',
    filterEmptyBoxes: 'صناديق فارغة جاهزة',
    totalBoxesCount: 'إجمالي الصناديق',
    totalItemsInBoxes: 'إجمالي القطع المخزنة',
    totalCapitalInBoxes: 'رأس المال المخزن',
    potentialProfitInBoxes: 'الأرباح المتوقعة بالصناديق',
    printBoxLabelBtn: 'طباعة ملصق الباركود للصندوق',
    boxLabelSubtitle: 'ملصق تنظيمي للصندوق الفعلي في غرفتك',
    boxCapacityFullness: 'نسبة الامتلاء',
    boxFullWarning: 'الصندوق ممتلئ تقريباً!',

    // Vinted Generator additions
    vintedGeneratorTitle: 'توليد إعلان Vinted احترافي بالذكاء الاصطناعي',
    vintedGeneratorDesc: 'عنوان جذاب، ووصف منسق مع الهاشتاغات باللغة الفرنسية لزيادة سرعة البيع!',
    adLanguage: 'لغة الإعلان',
    frenchLang: 'الفرنسية (موصى بها لـ Vinted)',
    englishLang: 'الإنجليزية',
    arabicLang: 'العربية',
    titleCopied: 'تم نسخ العنوان!',
    descCopied: 'تم نسخ الوصف بالكامل!',
    fullAdCopied: 'تم نسخ الإعلان بالكامل!',
    copyFullAd: 'نسخ الإعلان بالكامل',
    copyTitleOnly: 'نسخ العنوان فقط',
    copyDescOnly: 'نسخ الوصف فقط',
    vintedTip: '💡 نصيحة Vinted: انسخ العنوان والوصف والصقهم مباشرة في تطبيق Vinted مع إضافة 3-5 صور واضحة وضوء طبيعي للقطعة.',

    // Print Label additions
    printLabelTitle: 'طباعة بطاقة التخزين ورمز SKU',
    printLabelDesc: 'الصق هذه البطاقة على كيس القطعة أو الصندوق لسرعة العثور عليها وتتبعها بدقة',
    printNow: 'طباعة الآن (Print)',

    // Product Modal specific keys
    editProductTitle: 'تعديل بيانات المنتج',
    addProductTitle: 'إضافة منتج جديد للمخزن',
    addProductDesc: 'حدد مكان الصندوق والأسعار لتتبع الأرباح بدقة وسرعة الشحن',
    productPhotosLabel: 'صور المنتج (تساعد في تذكره والإدراج على Vinted)',
    takePhoto: 'التقاط صورة',
    pasteImageUrl: 'أو الصق رابط صورة خارجية...',
    addImageUrl: 'إضافة رابط',
    productSkuLabel: 'رمز التخزين (SKU) *',
    productTitleLabel: 'اسم وعنوان المنتج *',
    storageLocationDesc: 'حدد أين ستخزن هذه القطعة بالضبط (مثلاً: صندوق رقم 1، شماعة 4، رف علوي) لتجدها فوراً عند البيع:',
    pricingSectionTitle: 'الأسعار وتكلفة الشراء وهامش الربح',
    purchasePriceModalLabel: 'سعر الشراء / التكلفة',
    targetPriceModalLabel: 'سعر البيع المستهدف',
    expectedNetProfitLabel: 'الربح الصافي المتوقع',
    statusCurrentLabel: 'الحالة الحالية',
    notesDefectsLabel: 'ملاحظات خاصة، عيوب أو مقاسات دقيقة',
    saveChanges: 'حفظ التعديلات',
    addToInventory: 'حفظ وإضافة للمخزن',

    // Feature 2: Barcode Scanner & SKU Finder
    navScanner: 'ماسح الباركود و SKU',
    btnScanBarcode: 'مسح باركود / SKU',
    scannerModalTitle: 'ماسح الباركود ورمز SKU بالكاميرا',
    scannerModalSubtitle: 'امسح ملصق الصندوق أو كود SKU للوصول الفوري للقطعة وتسجيل بيعها في ثوانٍ',
    cameraScanning: 'جارٍ تشغيل الكاميرا ومسح الرمز...',
    cameraPermissionDenied: 'تعذر الوصول للكاميرا أو تم رفض الإذن. يمكنك إدخال كود SKU يدوياً أدناه',
    scanInstruction: 'وجّه كاميرا الهاتف نحو باركود أو رمز SKU الملصق على كيس أو صندوق المنتج',
    manualSkuInput: 'أو اكتب كود SKU أو اسم القطعة للبحث المباشر',
    quickTestSamples: 'أو جرّب مسح إحدى القطع الموجودة في المخزن مباشرة:',
    itemFound: 'تم العثور على القطعة في المخزن بنجاح!',
    noItemFound: 'لم يتم العثور على قطعة مطابقة لهذا الرمز',
    scanAnother: 'مسح قطعة أخرى',
    quickActions: 'إجراءات سريعة فورية',
    changeBoxLocation: 'نقل لصندوق آخر',
    boxLocationUpdated: 'تم تحديث مكان التخزين بنجاح!',
    simulateScan: 'محاكاة المسح',

    // Feature 2: Vinted Offer & Negotiation Calculator
    navOfferCalculator: 'حاسبة عروض Vinted',
    offerCalculatorTitle: 'حاسبة عروض وتفاوض أسعار Vinted',
    offerCalculatorSubtitle: 'احسب صافي ربحك الحقيقي قبل قبول أو رفض عرض السعر من المشتري',
    originalTargetPrice: 'السعر المعروض الأصلي',
    buyerOfferPrice: 'عرض سعر المشتري (Offre)',
    discountPercentage: 'نسبة الخصم المطلوبة',
    calculatedProfitAtOffer: 'صافي ربحك في حال قبول العرض',
    offerRecommendation: 'توصية الذكاء والربحية',
    recommendAccept: '✅ عرض ممتاز! يحقق لك ربحاً مجزياً وهامش أمان جيد، ننصح بالقبول.',
    recommendCounter: '⚡ تفاوض واقترح سعراً وسطاً (Contre-offre) بقيمة :',
    recommendReject: '⚠️ العرض منخفض جداً ويقلل أرباحك عن الحد الأدنى، ننصح بالرفض أو عرض مضاد أعلى.',
    counterOfferSuggestion: 'سعر العرض المضاد المقترح',
    openOfferCalculator: 'حاسبة تفاوض العروض',
  },

  fr: {
    appName: 'Stock Vinted',
    appBadge: 'Vinted Pro',
    appDescription: 'Gestion d\'inventaire, boîtes de stockage et calcul de rentabilité nette',

    navInventory: 'Inventaire & Articles',
    navStorage: 'Emplacements & Boîtes',
    navAnalytics: 'Rapport de rentabilité',
    navAddProduct: 'Ajouter un article',
    navBackup: 'Sauvegarde & Export',

    mobileInventory: 'Inventaire',
    mobileStorage: 'Boîtes',
    mobileAnalytics: 'Rentabilité',
    mobileAdd: 'Ajouter',

    languageLabel: 'Langue',
    currencyLabel: 'Devise',

    statNetProfit: 'Bénéfice net réalisé',
    statItemsSold: 'articles vendus',
    statCapitalStorage: 'Capital immobilisé en stock',
    statCapitalStorageDesc: 'Coût d\'achat des articles non vendus',
    statReadyInStorage: 'articles prêts',
    statPotentialProfit: 'Bénéfice potentiel estimé',
    statPotentialRevenue: 'Valeur de vente estimée',
    statTotalItems: 'Articles gérés au total',
    statSalesRate: 'Taux de rotation / vente',
    statRoi: 'Retour sur investissement (ROI)',

    searchPlaceholder: 'Rechercher par titre, SKU, marque ou boîte...',
    filterAll: 'Tous',
    filterInStorage: 'En stock',
    filterListed: 'En vente',
    filterSold: 'Vendu',
    filterAllCategories: 'Toutes les catégories',
    filterAllLocations: 'Tous les emplacements',
    sortBy: 'Trier par',
    sortNewest: 'Plus récents',
    sortOldest: 'Plus anciens',
    sortCostHigh: 'Coût d\'achat : Décroissant',
    sortTargetHigh: 'Prix de vente : Décroissant',
    sortProfitHigh: 'Bénéfice estimé : Décroissant',
    clearFilters: 'Effacer les filtres',
    showingItems: 'Affichage de {count} sur {total} articles',
    noProductsFound: 'Aucun article trouvé',
    noProductsFoundDesc: 'Modifiez vos critères de recherche ou ajoutez un nouvel article.',
    addNewProduct: 'Ajouter un article',

    cardPurchasePrice: 'Coût d\'achat',
    cardTargetPrice: 'Prix visé',
    cardEstimatedProfit: 'Marge estimée',
    cardNetProfit: 'Bénéfice',
    cardLocation: 'Emplacement',
    cardNoImage: 'Sans photo',
    cardSoldOn: 'Vendu sur',
    btnGenerateVinted: 'Générer annonce Vinted prête à copier',
    btnRecordSale: 'Enregistrer la vente',
    btnReturnToStorage: 'Remettre en stock',
    btnMarkListed: 'En vente',
    btnMarkInStorage: 'En stock',
    btnEdit: 'Modifier',
    btnPrintLabel: 'Étiquette',
    btnDuplicate: 'Dupliquer',
    btnDelete: 'Supprimer',
    confirmDelete: 'Voulez-vous vraiment supprimer définitivement cet article du stock ?',

    modalAddTitle: 'Ajouter une pièce à l\'inventaire',
    modalEditTitle: 'Modifier l\'article',
    modalAddSubtitle: 'Renseignez les détails, le coût d\'achat et l\'emplacement exact de stockage',
    skuLabel: 'Code article (SKU)',
    skuAuto: 'Génération automatique',
    titleLabel: 'Titre de l\'article *',
    titlePlaceholder: 'Ex: Veste vintage en cuir véritable marron',
    brandLabel: 'Marque',
    brandPlaceholder: 'Ex: Zara, Nike, Ralph Lauren, Levi\'s...',
    categoryLabel: 'Catégorie *',
    sizeLabel: 'Taille',
    sizePlaceholder: 'Ex: M, 42 EU, 32W, Unique...',
    colorLabel: 'Couleur',
    colorPlaceholder: 'Ex: Noir, Bleu marine, Beige, Marron...',
    conditionLabel: 'État de l\'article *',
    storageLocationLabel: 'Emplacement / Boîte de stockage *',
    storageLocationPlaceholder: 'Ex: Boîte A1, Étagère 2, Cintre 1...',
    storageSuggestions: 'Suggestions rapides',
    purchasePriceLabel: 'Coût d\'achat *',
    targetPriceLabel: 'Prix de vente visé *',
    purchaseDateLabel: 'Date d\'achat',
    sourceLocationLabel: 'Lieu de chinage / Sourcing',
    sourceLocationPlaceholder: 'Ex: Friperie, Brocante, Vide-grenier, Soldes...',
    targetPlatformLabel: 'Plateforme de vente ciblée',
    statusLabel: 'Statut actuel de la pièce',
    notesLabel: 'Notes ou défauts éventuels',
    notesPlaceholder: 'Ex: Petit bouton manquant, tissu impeccable...',
    imagesLabel: 'Photos de l\'article',
    imagesHint: 'Téléversez depuis votre appareil ou prenez une photo',
    imageUrlPlaceholder: 'Ou collez l\'URL d\'une image...',
    btnCancel: 'Annuler',
    btnSave: 'Enregistrer l\'article',
    btnSaving: 'Enregistrement...',

    sellModalTitle: 'Enregistrer la vente & calculer le bénéfice',
    sellModalSubtitle: 'Calculez votre rentabilité nette après déduction des frais et des coûts d\'envoi',
    soldPriceLabel: 'Prix de vente final obtenu *',
    saleDateLabel: 'Date de vente *',
    sellingPlatformLabel: 'Plateforme sur laquelle l\'article a été vendu',
    vintedZeroFeeNote: '✓ Sur Vinted, le vendeur ne paie aucune commission de vente',
    customerNameLabel: 'Nom ou pseudo de l\'acheteur (optionnel)',
    customerNamePlaceholder: 'Ex: Lucas_paris, Sarah92...',
    platformFeesLabel: 'Frais de plateforme (commission)',
    shippingFeesLabel: 'Frais de port / emballage (à la charge du vendeur)',
    shippingFeesHint: 'Carton, pochette d\'envoi, scotch, étiquette...',
    netProfitCalculation: 'Bilan financier de la transaction',
    netProfitLabel: 'Bénéfice net réel',
    roiLabel: 'Retour sur investissement (ROI)',
    marginLabel: 'Marge nette',
    btnConfirmSale: 'Confirmer la vente & Enregistrer le bénéfice',

    printModalTitle: 'Étiquette d\'inventaire & Stockage',
    printInstructions: 'Imprimez cette étiquette et fixez-la sur le sachet ou le cintre pour retrouver l\'article en quelques secondes lors de l\'envoi :',
    printTargetPrice: 'Prix de vente visé',
    btnPrintNow: 'Imprimer maintenant',
    btnClose: 'Fermer',

    vintedModalTitle: 'Générateur d\'annonce Vinted',
    vintedModalSubtitle: 'Générez un texte d\'annonce attractif avec hashtags pour maximiser vos ventes',
    listingLangLabel: 'Langue de l\'annonce :',
    langFrench: '🇫🇷 Français',
    langFrenchRecommended: '(Recommandé pour Vinted)',
    langEnglish: '🇬🇧 Anglais',
    langArabic: '🇸🇦 Arabe',
    vintedTitleLabel: 'Titre de l\'annonce (Vinted Title) :',
    vintedDescLabel: 'Description & Hashtags (Vinted Description) :',
    btnCopyTitleOnly: 'Copier le titre',
    btnCopyDescOnly: 'Copier la description',
    btnCopyAll: 'Copier l\'annonce complète',
    copiedSuccess: 'Copié avec succès ! Prêt à coller sur Vinted',
    copiedTitleSuccess: 'Titre copié !',
    copiedDescSuccess: 'Description copiée !',
    vintedModalTip: '💡 Vous pouvez modifier n\'importe quel texte ci-dessus avant de le copier sur Vinted.',

    storageViewTitle: 'Emplacements & Boîtes de stockage',
    storageViewSubtitle: 'Retrouvez immédiatement l\'emplacement exact de chaque pièce chez vous dès réception d\'une commande',
    searchLocationsPlaceholder: 'Rechercher une boîte ou un lieu...',
    totalLocationsCount: 'emplacements enregistrés',
    activeItemsInBox: 'articles prêts en stock',
    itemsSoldFromBox: 'vendus',
    costInBox: 'Capital immobilisé dans la boîte',
    potentialValueInBox: 'Valeur de vente estimée',
    recentItemsInBox: 'Derniers articles dans cette boîte :',
    btnViewBoxItems: 'Voir les articles de la boîte',
    btnAddItemToBox: 'Ajouter un article dans cette boîte',
    noLocationsFound: 'Aucune boîte correspondante',
    noLocationsFoundDesc: 'Ajoutez un article avec un emplacement de stockage pour le voir apparaître ici.',

    analyticsTitle: 'Rapport financier & Analyse de rentabilité',
    analyticsSubtitle: 'Vue globale sur vos performances de revente, marges et rotation des stocks',
    totalRevenue: 'Chiffre d\'affaires total réalisé',
    totalCostSold: 'Coût d\'achat des articles vendus',
    avgProfitPerItem: 'Bénéfice moyen par pièce',
    salesByPlatform: 'Répartition des ventes par plateforme',
    salesByCategory: 'Rentabilité par catégorie d\'article',
    monthlyPerformance: 'Performance financière mensuelle',
    inventoryBreakdown: 'Répartition du capital en stock',

    backupModalTitle: 'Sauvegarde & Export des données',
    backupModalSubtitle: 'Sécurisez vos données ou exportez-les vers Excel pour des analyses poussées',
    exportCsvTitle: 'Exporter au format Excel / CSV',
    exportCsvDesc: 'Téléchargez un tableau complet de tous vos articles, coûts, emplacements et bénéfices.',
    btnExportCsv: 'Télécharger le fichier Excel (CSV)',
    exportJsonTitle: 'Sauvegarde complète (JSON)',
    exportJsonDesc: 'Enregistrez une copie exacte de vos données pour les restaurer sur un autre appareil.',
    btnExportJson: 'Télécharger la sauvegarde',
    importJsonTitle: 'Restaurer une sauvegarde',
    importJsonDesc: 'Importez un fichier de sauvegarde précédemment exporté.',
    btnImportJson: 'Importer le fichier JSON',
    resetSampleDataTitle: 'Réinitialiser les données d\'exemple',
    resetSampleDataDesc: 'Chargez des articles d\'exemple pour tester toutes les fonctionnalités.',
    btnResetSampleData: 'Charger les données de test',

    offlineBanner: 'Vous travaillez actuellement hors ligne. Vos modifications sont enregistrées localement en toute sécurité.',
    onlineBanner: 'Connexion Internet rétablie avec succès !',

    // Shared / Common UI
    cancel: 'Annuler',
    close: 'Fermer',
    brand: 'Marque',
    unspecified: 'Non spécifié',
    storageLocation: 'Emplacement de stockage',
    recommended: 'Recommandé',

    // Additional Profit Analytics
    financialPerformanceTitle: 'Analyse de la performance financière nette',
    totalNetProfitsBanner: 'Bénéfice net total',
    successfulSalesBadge: 'ventes réussies',
    revenueTotal: 'Chiffre d\'affaires total',
    cogsTotal: 'Coût des marchandises vendues (COGS)',
    grossMargin: 'Marge bénéficiaire brute',
    topBrandsTitle: 'Marques les plus rentables',
    byNetProfit: 'Par bénéfice net',
    itemsCount: 'articles',
    notEnoughSalesBrands: 'Pas encore assez de ventes pour établir le classement des marques.',
    topCategoriesTitle: 'Bénéfices par catégorie',
    bySales: 'Par volume de vente',
    salesCount: 'ventes',
    noSalesInCategories: 'Aucune vente enregistrée dans les catégories pour l\'instant.',
    salesHistoryTitle: 'Historique des ventes & profits individuels',
    completedSales: 'ventes finalisées',
    tableProductSku: 'Article & SKU',
    tableSaleDate: 'Date de vente',
    tablePlatform: 'Plateforme',
    tableCostPrice: 'Coût d\'achat',
    tableSoldPrice: 'Prix vendu',
    tableFeesShipping: 'Frais & Envoi',
    tableNetProfit: 'Bénéfice net',
    tableRoi: 'Rentabilité (ROI)',
    noSalesRecordedYet: 'Aucune vente enregistrée pour le moment. Dès qu\'un article est vendu, il apparaîtra ici avec tous ses détails de bénéfice !',
    otherBrand: 'Autre marque',

    // Sell Modal additions
    successfulSaleTitle: 'Enregistrer une vente réussie',
    successfulSaleDesc: 'Saisissez les détails de vente pour calculer le profit net réel et mettre à jour le stock automatiquement',
    origPurchaseCost: 'Coût d\'achat initial',
    finalSoldPrice: 'Prix de vente final de l\'article',
    saleDate: 'Date de la vente',
    vintedZeroSellerFees: '💡 Sur Vinted, aucune commission n\'est déduite du vendeur (0%)',
    buyerNameOptional: 'Nom de l\'acheteur (facultatif)',
    platformCommission: 'Commission plateforme / passerelle',
    packagingShippingCost: 'Frais d\'emballage & expédition (à votre charge)',
    realNetProfitThisItem: 'Bénéfice net réel sur cet article',
    netMarginLabel: 'Marge nette',
    calculationFormula: 'Calcul : Prix de vente - (Coût d\'achat + Commission + Frais d\'expédition)',
    confirmSaleBtn: 'Confirmer & Enregistrer la vente',

    // Storage Locations View additions
    unspecifiedBox: 'Boîte non assignée',
    storageLocationsTitle: 'Gestion des emplacements et boîtes de stockage',
    storageLocationsDesc: 'Repérez précisément dans quelle boîte ou étagère se trouve chaque article pour expédier rapidement',
    searchLocationPlaceholder: 'Rechercher une boîte, étagère ou bac...',
    itemsInStock: 'articles en stock',
    soldItemsCount: 'vendus',
    itemsInBox: 'articles dans la boîte',
    potentialValue: 'Valeur potentielle',
    latestItemsInLocation: 'Derniers articles ajoutés ici :',
    viewBoxItems: 'Voir tous les articles de la boîte',
    addToThisBox: 'Ajouter un article dans cette boîte',
    noMatchingBoxes: 'Aucune boîte correspondante trouvée',
    noMatchingBoxesDesc: 'Essayez un autre mot-clé ou attribuez une nouvelle boîte lors de l\'ajout d\'un article.',

    // Storage Boxes Management additions
    addStorageBoxBtn: 'Ajouter une boîte / étagère',
    newStorageBoxTitle: 'Ajouter une nouvelle boîte de stockage',
    editStorageBoxTitle: 'Modifier l\'emplacement de stockage',
    boxNameLabel: 'Nom de la boîte ou de l\'étagère',
    boxNamePlaceholder: 'Ex: Boîte A4, Étagère 2, Penderie 3...',
    boxZoneLabel: 'Zone ou pièce de stockage',
    boxZonePlaceholder: 'Ex: Pièce de stockage, Étagère haute, Garage...',
    boxColorLabel: 'Couleur de repérage visuel',
    boxCapacityLabel: 'Capacité maximale (nb d\'articles - optionnel)',
    boxNotesLabel: 'Notes ou type d\'articles',
    boxNotesPlaceholder: 'Ex: Vestes d\'hiver, baskets nettoyées, accessoires...',
    saveBoxBtn: 'Enregistrer l\'emplacement',
    updateBoxBtn: 'Mettre à jour',
    deleteBoxBtn: 'Supprimer l\'emplacement',
    deleteBoxConfirm: 'Voulez-vous vraiment supprimer cet emplacement ?',
    boxHasItemsWarning: 'Attention : Cette boîte contient des articles ! Veuillez d\'abord déplacer les articles ou renommer la boîte.',
    updateLinkedProducts: 'Mettre à jour automatiquement les articles associés avec le nouveau nom',
    emptyBoxBadge: 'Boîte vide',
    emptyBoxDesc: 'Prête à accueillir du nouveau stock',
    filterAllBoxes: 'Toutes les boîtes',
    filterOccupiedBoxes: 'Avec stock',
    filterEmptyBoxes: 'Boîtes vides',
    totalBoxesCount: 'Total boîtes',
    totalItemsInBoxes: 'Total articles stockés',
    totalCapitalInBoxes: 'Capital en stock',
    potentialProfitInBoxes: 'Bénéfice potentiel estimé',
    printBoxLabelBtn: 'Imprimer code-barres de la boîte',
    boxLabelSubtitle: 'Étiquette pour boîte physique',
    boxCapacityFullness: 'Remplissage',
    boxFullWarning: 'Boîte presque pleine !',

    // Vinted Generator additions
    vintedGeneratorTitle: 'Générateur d\'annonce Vinted avec IA',
    vintedGeneratorDesc: 'Titre accrocheur et description soignée avec hashtags en français pour vendre plus vite !',
    adLanguage: 'Langue de l\'annonce',
    frenchLang: 'Français (recommandé pour Vinted)',
    englishLang: 'Anglais',
    arabicLang: 'Arabe',
    titleCopied: 'Titre copié !',
    descCopied: 'Description complète copiée !',
    fullAdCopied: 'Annonce complète copiée !',
    copyFullAd: 'Copier toute l\'annonce',
    copyTitleOnly: 'Copier uniquement le titre',
    copyDescOnly: 'Copier uniquement la description',
    vintedTip: '💡 Conseil Vinted : Copiez le titre et la description dans Vinted, et ajoutez 3 à 5 photos bien éclairées à la lumière du jour.',

    // Print Label additions
    printLabelTitle: 'Imprimer l\'étiquette d\'inventaire & code SKU',
    printLabelDesc: 'Collez cette étiquette sur le sachet ou la boîte de l\'article pour le retrouver immédiatement',
    printNow: 'Imprimer maintenant',

    // Product Modal specific keys
    editProductTitle: 'Modifier l\'article',
    addProductTitle: 'Ajouter un article en stock',
    addProductDesc: 'Indiquez l\'emplacement de stockage et les prix pour suivre la rentabilité nette',
    productPhotosLabel: 'Photos de l\'article (pour l\'identification et la mise en vente sur Vinted)',
    takePhoto: 'Prendre une photo',
    pasteImageUrl: 'Ou coller l\'URL d\'une image...',
    addImageUrl: 'Ajouter l\'URL',
    productSkuLabel: 'Code de stockage (SKU) *',
    productTitleLabel: 'Titre & description courte *',
    storageLocationDesc: 'Précisez exactement où cet article est rangé (ex: Boîte A1, Rayon 3, Penderie) pour l\'expédier aussitôt vendu :',
    pricingSectionTitle: 'Prix, coût d\'achat & rentabilité visée',
    purchasePriceModalLabel: 'Prix d\'achat / Coût de revient',
    targetPriceModalLabel: 'Prix de vente visé',
    expectedNetProfitLabel: 'Bénéfice net estimé',
    statusCurrentLabel: 'Statut actuel',
    notesDefectsLabel: 'Remarques particulières, défauts éventuels ou mesures',
    saveChanges: 'Enregistrer les modifications',
    addToInventory: 'Ajouter à l\'inventaire',

    // Feature 2: Barcode Scanner & SKU Finder
    navScanner: 'Scanner Code-barres & SKU',
    btnScanBarcode: 'Scanner Code-barres / SKU',
    scannerModalTitle: 'Scanner de code-barres & SKU par caméra',
    scannerModalSubtitle: 'Scannez l\'étiquette de la boîte ou le SKU pour retrouver l\'article et enregistrer sa vente instantanément',
    cameraScanning: 'Activation de la caméra et analyse en cours...',
    cameraPermissionDenied: 'Accès caméra refusé ou non disponible. Vous pouvez saisir le code SKU ci-dessous',
    scanInstruction: 'Pointez la caméra vers le code-barres ou le SKU collé sur le sachet ou la boîte',
    manualSkuInput: 'Ou saisissez le code SKU ou nom d\'article pour recherche directe',
    quickTestSamples: 'Ou testez avec un article actuellement en stock :',
    itemFound: 'Article trouvé dans votre inventaire !',
    noItemFound: 'Aucun article correspondant à ce code',
    scanAnother: 'Scanner un autre article',
    quickActions: 'Actions rapides',
    changeBoxLocation: 'Déplacer dans une autre boîte',
    boxLocationUpdated: 'Emplacement de stockage mis à jour avec succès !',
    simulateScan: 'Simuler le scan',

    // Feature 2: Vinted Offer & Negotiation Calculator
    navOfferCalculator: 'Calculateur d\'offres Vinted',
    offerCalculatorTitle: 'Calculateur d\'offres & négociation Vinted',
    offerCalculatorSubtitle: 'Calculez votre bénéfice net réel avant d\'accepter ou refuser une offre acheteur',
    originalTargetPrice: 'Prix affiché initial',
    buyerOfferPrice: 'Offre reçue de l\'acheteur (Offre)',
    discountPercentage: 'Pourcentage de réduction demandé',
    calculatedProfitAtOffer: 'Votre bénéfice net si offre acceptée',
    offerRecommendation: 'Recommandation de rentabilité',
    recommendAccept: '✅ Excellente offre ! Marge solide et rentabilité assurée, vous pouvez accepter.',
    recommendCounter: '⚡ Négociez ! Faites une contre-offre équilibrée à :',
    recommendReject: '⚠️ Offre trop basse ! Votre marge nette serait insuffisante, refusez ou contre-offrez plus haut.',
    counterOfferSuggestion: 'Suggestion de contre-offre équilibrée',
    openOfferCalculator: 'Calculateur de négociation',
  },
};

export const CATEGORY_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    clothing: 'ملابس',
    shoes: 'أحذية',
    bags: 'حقائب ومحافظ',
    accessories: 'إكسسوارات وساعات',
    electronics: 'إلكترونيات',
    beauty: 'عناية وجمال',
    home: 'ديكور ومنزل',
    other: 'أخرى',
  },
  fr: {
    clothing: 'Vêtements',
    shoes: 'Chaussures',
    bags: 'Sacs & Maroquinerie',
    accessories: 'Accessoires & Montres',
    electronics: 'Électronique',
    beauty: 'Beauté & Soins',
    home: 'Maison & Décoration',
    other: 'Autres',
  },
};

export const CONDITION_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    new_with_tag: 'جديد مع التيكيت (NWT)',
    new_no_tag: 'جديد بدون تيكيت',
    very_good: 'حالة ممتازة (بدون عيوب)',
    good: 'حالة جيدة (استعمال بسيط)',
    satisfactory: 'مقبول (به أثر استخدام)',
  },
  fr: {
    new_with_tag: 'Neuf avec étiquette (NWT)',
    new_no_tag: 'Neuf sans étiquette',
    very_good: 'Très bon état',
    good: 'Bon état',
    satisfactory: 'État satisfaisant',
  },
};

export const STATUS_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    in_storage: 'في المخزن',
    listed: 'معروض للبيع',
    sold: 'تم البيع 🎉',
    shipped: 'تم الشحن',
    archived: 'مؤرشف / ملغي',
  },
  fr: {
    in_storage: 'En stock',
    listed: 'En vente',
    sold: 'Vendu 🎉',
    shipped: 'Expédié',
    archived: 'Archivé',
  },
};

export const COMMON_LOCATIONS_I18N: Record<Language, string[]> = {
  ar: [
    'صندوق A1',
    'صندوق A2',
    'صندوق B1',
    'صندوق B2',
    'الرف العلوي',
    'الرف الأوسط',
    'شماعة الملابس 1',
    'حقيبة التخزين 1',
    'خزانة الأحذية',
  ],
  fr: [
    'Boîte A1',
    'Boîte A2',
    'Boîte B1',
    'Boîte B2',
    'Étagère haute',
    'Étagère milieu',
    'Portant vêtements 1',
    'Bac de rangement 1',
    'Meuble à chaussures',
  ],
};
