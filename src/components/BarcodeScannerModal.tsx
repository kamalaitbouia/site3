import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  ScanLine, 
  X, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Archive, 
  DollarSign, 
  Printer, 
  Sparkles, 
  Calculator, 
  RefreshCw, 
  Copy, 
  Check,
  Zap,
  ZapOff,
  FlipHorizontal,
  ImagePlus,
  Plus,
  ArrowRight
} from 'lucide-react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { Product, Currency } from '../types';
import { useI18n } from '../lib/i18n';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProductToSell: (product: Product) => void;
  onSelectProductForLabel: (product: Product) => void;
  onSelectProductForListing: (product: Product) => void;
  onUpdateProductLocation: (productId: string, newLocation: string) => void;
  onUpdateProductStatus: (productId: string, newStatus: Product['status']) => void;
  allLocations: string[];
  onAddNewWithSku?: (sku: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProductToSell,
  onSelectProductForLabel,
  onSelectProductForListing,
  onUpdateProductLocation,
  onUpdateProductStatus,
  allLocations,
  onAddNewWithSku,
}) => {
  const { t, lang, getCategoryName } = useI18n();
  const [activeTab, setActiveTab] = useState<'scanner' | 'calculator'>('scanner');
  
  // Camera & Video stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanSuccessFlash, setScanSuccessFlash] = useState(false);

  // Search & Found item state
  const [manualInput, setManualInput] = useState('');
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [showLocationSaved, setShowLocationSaved] = useState(false);

  // Offer Calculator state
  const [selectedCalcProduct, setSelectedCalcProduct] = useState<Product | null>(null);
  const [calcTargetPrice, setCalcTargetPrice] = useState<number>(0);
  const [calcCostPrice, setCalcCostPrice] = useState<number>(0);
  const [calcPackagingCost, setCalcPackagingCost] = useState<number>(0.5);
  const [buyerOffer, setBuyerOffer] = useState<number>(0);
  const [copiedCounterMsg, setCopiedCounterMsg] = useState(false);

  // Play a crisp confirmation chime when item is detected
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      if (navigator.vibrate) {
        navigator.vibrate([50, 40, 50]);
      }
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Stop camera feed and release media tracks
  const stopCamera = () => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (e) {
        // ignore
      }
      controlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setIsTorchOn(false);
    setIsTorchSupported(false);
  };

  // Start camera feed using @zxing/browser
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (!videoRef.current) return;
      videoRef.current.srcObject = mediaStream;
      await videoRef.current.play();

      const reader = new BrowserMultiFormatReader(undefined, {
        delayBetweenScanAttempts: 80,
        delayBetweenScanSuccess: 1200,
      });
      codeReaderRef.current = reader;

      const controls = await reader.decodeFromVideoElement(
        videoRef.current,
        (result, error) => {
          if (result) {
            const text = result.getText();
            if (text) {
              handleCodeScanned(text);
            }
          }
        }
      );
      controlsRef.current = controls;

      // Safely check if torch/flashlight is supported
      try {
        const track = mediaStream.getVideoTracks()[0];
        if (track && typeof track.getCapabilities === 'function') {
          const caps = track.getCapabilities() as { torch?: boolean };
          if (caps && Boolean(caps.torch)) {
            setIsTorchSupported(true);
          } else {
            setIsTorchSupported(false);
          }
        }
      } catch {
        setIsTorchSupported(false);
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.warn('Camera stream error:', e.message);
      setCameraError(t.cameraPermissionDenied || 'تعذر فتح الكاميرا، يرجى منح الإذن أو استخدام البحث اليدوي.');
      setIsScanning(false);
    }
  };

  // Process barcode detection loop when tab changes or modal opens
  useEffect(() => {
    if (!isOpen || activeTab !== 'scanner') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode]);

  // Toggle Torch / Flashlight safely
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track || track.readyState !== 'live') return;

    const nextTorch = !isTorchOn;
    try {
      await track.applyConstraints({
        advanced: [{ torch: nextTorch } as MediaTrackConstraintSet],
      });
      setIsTorchOn(nextTorch);
    } catch (err) {
      console.warn('Failed to toggle torch:', err);
      setIsTorchSupported(false);
      setIsTorchOn(false);
    }
  };

  // Flip Camera between Back and Front
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Decode barcode from an uploaded image or photo
  const handleScanFromImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsScanningImage(true);
      const imageUrl = URL.createObjectURL(file);
      const reader = codeReaderRef.current || new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(imageUrl);
      URL.revokeObjectURL(imageUrl);

      if (result && result.getText()) {
        handleCodeScanned(result.getText());
      } else {
        throw new Error('No barcode detected');
      }
    } catch (err) {
      console.warn('Could not decode barcode from image:', err);
      alert(
        lang === 'fr'
          ? 'Aucun code-barres net n\'a été détecté sur cette photo. Essayez une image plus nette et bien éclairée.'
          : 'لم يتم العثور على باركود واضح في هذه الصورة. يرجى تجربة صورة واضحة ومقربة للملصق.'
      );
    } finally {
      setIsScanningImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // When a code (SKU or ID or title) is scanned or typed
  const handleCodeScanned = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    // Clean asterisks if Code 39 reader preserved them (e.g. *VIN-107* -> VIN-107)
    const clean = code.replace(/^\*+|\*+$/g, '').trim();

    setScannedCode(clean || code);
    setScanSuccessFlash(true);
    setTimeout(() => setScanSuccessFlash(false), 1200);
    playBeep();

    const normalizedClean = (clean || code).toLowerCase();
    const normalizedRaw = code.toLowerCase();

    const found = products.find((p) => {
      const pSkuClean = p.sku.trim().replace(/^\*+|\*+$/g, '').toLowerCase();
      const pSkuRaw = p.sku.trim().toLowerCase();
      const pId = p.id.toLowerCase();
      return (
        pSkuClean === normalizedClean ||
        pSkuRaw === normalizedRaw ||
        pSkuClean === normalizedRaw ||
        pSkuRaw === normalizedClean ||
        pId === normalizedClean ||
        (clean.length >= 3 && p.title.toLowerCase().includes(normalizedClean))
      );
    });

    if (found) {
      setMatchedProduct(found);
      setNewLocationInput(found.storageLocation || '');
      // Prefill offer calculator
      setSelectedCalcProduct(found);
      setCalcTargetPrice(found.targetPrice);
      setCalcCostPrice(found.purchasePrice);
      setBuyerOffer(Math.round(found.targetPrice * 0.8));
    } else {
      setMatchedProduct(null);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleCodeScanned(manualInput);
  };

  const handleSaveLocation = () => {
    if (!matchedProduct || !newLocationInput.trim()) return;
    onUpdateProductLocation(matchedProduct.id, newLocationInput.trim());
    setMatchedProduct({ ...matchedProduct, storageLocation: newLocationInput.trim() });
    setShowLocationSaved(true);
    setTimeout(() => setShowLocationSaved(false), 2500);
  };

  // Sync offer calculator when a product is selected
  const handleSelectProductForCalc = (p: Product) => {
    setSelectedCalcProduct(p);
    setCalcTargetPrice(p.targetPrice);
    setCalcCostPrice(p.purchasePrice);
    setBuyerOffer(Math.round(p.targetPrice * 0.8));
  };

  // Offer calculation math
  const discountAmount = Math.max(0, calcTargetPrice - buyerOffer);
  const discountPercent = calcTargetPrice > 0 ? Math.round((discountAmount / calcTargetPrice) * 100) : 0;
  const netProfitAtOffer = buyerOffer - calcCostPrice - calcPackagingCost;
  const marginAtOffer = buyerOffer > 0 ? Math.round((netProfitAtOffer / buyerOffer) * 100) : 0;

  // Counter offer suggestion (fair compromise between target and buyer offer)
  const suggestedCounterOffer = Math.round(((calcTargetPrice + buyerOffer) / 2) * 10) / 10;

  // Copy Vinted counter offer message
  const handleCopyCounterMessage = () => {
    const msg = lang === 'fr'
      ? `Bonjour ! Merci beaucoup pour votre intérêt. Je peux faire un geste à ${suggestedCounterOffer}€ pour cet article en parfait état. Si cela vous convient, vous pouvez faire l'offre directement !`
      : `مرحباً! شكراً لاهتمامك بالقطعة. يمكنني قبول سعر ${suggestedCounterOffer} ${currency.symbol} كعرض مناسب للطرفين، أرجو تقديم العرض عبر التطبيق!`;
    navigator.clipboard.writeText(msg);
    setCopiedCounterMsg(true);
    setTimeout(() => setCopiedCounterMsg(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                {activeTab === 'scanner' ? t.scannerModalTitle : t.offerCalculatorTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {activeTab === 'scanner' ? t.scannerModalSubtitle : t.offerCalculatorSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'scanner'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>{t.navScanner}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('calculator');
              stopCamera();
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{t.navOfferCalculator}</span>
            <span className="text-3xs px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Vinted
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {activeTab === 'scanner' ? (
            <>
              {/* Camera Scanner Viewport */}
              <div className="relative aspect-video max-h-64 sm:max-h-72 w-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border-2 border-slate-800 shadow-inner">
                {cameraError ? (
                  <div className="p-6 text-center text-slate-300 max-w-sm">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 mb-3">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                      {lang === 'fr' ? 'Réessayer la caméra' : 'إعادة محاولة الكاميرا'}
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />

                    {/* Camera Control Overlays (Torch + Flip + Image Upload) */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                      <button
                        type="button"
                        onClick={handleFlipCamera}
                        className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-2xs font-semibold backdrop-blur-md border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                        title={lang === 'fr' ? 'Changer de caméra' : 'تبديل الكاميرا'}
                      >
                        <FlipHorizontal className="w-3.5 h-3.5 text-teal-400" />
                        <span>{lang === 'fr' ? 'Caméra' : 'تبديل'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {isTorchSupported && (
                          <button
                            type="button"
                            onClick={handleToggleTorch}
                            className={`px-2.5 py-1 rounded-xl text-2xs font-semibold backdrop-blur-md border transition cursor-pointer flex items-center gap-1 ${
                              isTorchOn
                                ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                                : 'bg-slate-900/80 hover:bg-slate-900 text-white border-slate-700'
                            }`}
                          >
                            {isTorchOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{isTorchOn ? (lang === 'fr' ? 'Flash On' : 'الفلاش منير') : (lang === 'fr' ? 'Flash' : 'فلاش')}</span>
                          </button>
                        )}

                        <label
                          className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-2xs font-semibold backdrop-blur-md border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
                          title={lang === 'fr' ? 'Importer une image de code-barres' : 'مسح من صورة أو ملصق'}
                        >
                          <ImagePlus className="w-3.5 h-3.5 text-teal-400" />
                          <span>{lang === 'fr' ? 'Photo' : 'صورة'}</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleScanFromImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Aiming Reticle overlay with laser */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className={`w-56 h-36 border-2 rounded-2xl relative transition-all duration-300 ${
                        scanSuccessFlash
                          ? 'border-emerald-400 shadow-[0_0_24px_#34d399] scale-105'
                          : 'border-teal-400/80 shadow-lg'
                      }`}>
                        {/* Scanning Laser Line */}
                        <div className={`absolute left-1 right-1 h-0.5 shadow-[0_0_12px_#2dd4bf] transition-colors ${
                          scanSuccessFlash ? 'bg-emerald-400 shadow-[0_0_16px_#34d399]' : 'bg-teal-400 animate-bounce'
                        }`} />
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-teal-400 rounded-tl" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-teal-400 rounded-tr" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-teal-400 rounded-bl" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-teal-400 rounded-br" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-2xs font-medium">
                        {isScanningImage ? (lang === 'fr' ? 'Lecture de la photo...' : 'جارٍ معالجة الصورة...') : t.scanInstruction}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Manual SKU Search & Quick Barcode simulation */}
              <form onSubmit={handleManualSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder={t.manualSkuInput}
                    className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  {lang === 'fr' ? 'Chercher' : 'بحث'}
                </button>
              </form>

              {/* Quick test simulation pills for items currently in stock */}
              {products.length > 0 && (
                <div>
                  <span className="text-2xs font-semibold text-slate-500 block mb-1.5">
                    {t.quickTestSamples}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {products.slice(0, 6).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleCodeScanned(p.sku)}
                        className={`text-2xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                          matchedProduct?.id === p.id
                            ? 'bg-teal-600 text-white border-teal-600 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-mono font-bold text-teal-600 bg-teal-50 px-1 py-0.2 rounded">
                          {p.sku}
                        </span>
                        <span className="truncate max-w-[120px]">{p.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Product Result Card - FOUND IN INVENTORY */}
              {matchedProduct ? (
                <div className="bg-gradient-to-br from-teal-50/60 to-white rounded-2xl border-2 border-teal-400/80 p-4 shadow-md space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-teal-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.itemFound}</span>
                    </div>
                    <span className="font-mono text-xs font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
                      SKU: {matchedProduct.sku}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <img
                      src={matchedProduct.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=300'}
                      alt={matchedProduct.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">
                        {matchedProduct.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>{matchedProduct.brand || t.unspecified}</span>
                        <span>•</span>
                        <span>{getCategoryName(matchedProduct.category)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-teal-700">
                          {matchedProduct.targetPrice} {currency.symbol}
                        </span>
                        <span className="text-3xs text-slate-400">
                          ({lang === 'fr' ? 'Coût:' : 'التكلفة:'} {matchedProduct.purchasePrice} {currency.symbol})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT STORAGE LOCATION BOX HIGHLIGHT */}
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Archive className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-3xs font-bold uppercase tracking-wider text-amber-700 block">
                          {t.storageLocation}
                        </span>
                        <span className="text-sm font-black text-amber-950">
                          📦 {matchedProduct.storageLocation || t.unspecifiedBox}
                        </span>
                      </div>
                    </div>

                    {/* Quick Move Box form */}
                    <div className="flex items-center gap-1 w-full sm:w-auto">
                      <input
                        type="text"
                        value={newLocationInput}
                        onChange={(e) => setNewLocationInput(e.target.value)}
                        placeholder={t.changeBoxLocation}
                        className="px-2.5 py-1 text-xs rounded-lg border border-amber-300 bg-white text-slate-800 focus:outline-hidden w-full sm:w-32 font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleSaveLocation}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        {showLocationSaved ? '✓' : (lang === 'fr' ? 'Changer' : 'نقل')}
                      </button>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Record Sale Button (Main Action) */}
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        onClose();
                        onSelectProductToSell(matchedProduct);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition cursor-pointer col-span-2 sm:col-span-1"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{lang === 'fr' ? 'Enregistrer la vente' : 'تسجيل البيع'}</span>
                    </button>

                    {/* Vinted Generator */}
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        onClose();
                        onSelectProductForListing(matchedProduct);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Vinted</span>
                    </button>

                    {/* Print Label */}
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        onClose();
                        onSelectProductForLabel(matchedProduct);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>{lang === 'fr' ? 'Étiquette' : 'طباعة ملصق'}</span>
                    </button>

                    {/* Open Offer Calculator */}
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectProductForCalc(matchedProduct);
                        setActiveTab('calculator');
                        stopCamera();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200 transition cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-teal-600" />
                      <span>{lang === 'fr' ? 'Offres' : 'العروض'}</span>
                    </button>
                  </div>
                </div>
              ) : scannedCode ? (
                /* CODE DETECTED BUT NOT FOUND IN INVENTORY - HELPFUL ACTION CARD */
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl p-4 border-2 border-amber-300 shadow-sm space-y-3 animate-in fade-in duration-200 text-amber-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'fr' ? 'Code détecté avec succès !' : 'تم قراءة الرمز بنجاح!'}</span>
                    </div>
                    <span className="font-mono text-xs font-black bg-amber-200/90 text-amber-950 px-3 py-1 rounded-lg border border-amber-300">
                      {scannedCode}
                    </span>
                  </div>

                  <p className="text-xs text-amber-900 leading-relaxed">
                    {lang === 'fr'
                      ? `Le code-barres "${scannedCode}" est bien scanné, mais il n'existe pas encore dans votre inventaire.`
                      : `تمت قراءة الرمز "${scannedCode}" بنجاح، لكنه غير مسجل حالياً كقطعة في مخزونك.`}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        onClose();
                        onAddNewWithSku?.(scannedCode);
                      }}
                      className="flex-1 min-w-[170px] py-2.5 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {lang === 'fr' ? `Ajouter un article (${scannedCode})` : `تسجيل قطعة جديدة بالكود (${scannedCode})`}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScannedCode(null)}
                      className="py-2.5 px-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/60 text-amber-900 font-bold text-xs transition cursor-pointer"
                    >
                      {lang === 'fr' ? 'Scanner un autre' : 'مسح قطعة أخرى'}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            /* TAB 2: VINTED OFFER & NEGOTIATION CALCULATOR */
            <div className="space-y-4">
              {/* Product Selector for calculation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'fr' ? 'Sélectionner l\'article négocié :' : 'اختر القطعة التي وصلك عليها عرض سعر:'}
                </label>
                <select
                  value={selectedCalcProduct?.id || ''}
                  onChange={(e) => {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) handleSelectProductForCalc(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                >
                  <option value="">
                    {lang === 'fr' ? '-- Saisir manuellement ou choisir un article --' : '-- كتابة الأسعار يدوياً أو اختيار قطعة من المخزن --'}
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.title} ({p.targetPrice} {currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-2xs font-bold text-slate-600 mb-1">
                    {t.originalTargetPrice} ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={calcTargetPrice || ''}
                    onChange={(e) => setCalcTargetPrice(parseFloat(e.target.value) || 0)}
                    placeholder="25"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-2xs font-bold text-slate-600 mb-1">
                    {t.tableCostPrice} ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={calcCostPrice || ''}
                    onChange={(e) => setCalcCostPrice(parseFloat(e.target.value) || 0)}
                    placeholder="8"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
                  <label className="block text-2xs font-black text-teal-900 mb-1">
                    ⚡ {t.buyerOfferPrice} ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={buyerOffer || ''}
                    onChange={(e) => setBuyerOffer(parseFloat(e.target.value) || 0)}
                    placeholder="18"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs font-black text-teal-800 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Offer Calculation Results Card */}
              <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-3xs font-semibold text-slate-400 block">
                      {t.discountPercentage}
                    </span>
                    <span className={`text-sm font-black ${discountPercent > 30 ? 'text-amber-600' : 'text-slate-700'}`}>
                      -{discountPercent}%
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-3xs font-semibold text-slate-400 block">
                      {t.calculatedProfitAtOffer}
                    </span>
                    <span className={`text-sm font-black ${netProfitAtOffer >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
                      {netProfitAtOffer >= 0 ? '+' : ''}{netProfitAtOffer.toFixed(1)} {currency.symbol}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-3xs font-semibold text-slate-400 block">
                      {t.netMarginLabel}
                    </span>
                    <span className="text-sm font-black text-teal-700">
                      {marginAtOffer}%
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-3xs font-semibold text-slate-400 block">
                      {t.counterOfferSuggestion}
                    </span>
                    <span className="text-sm font-black text-teal-800">
                      {suggestedCounterOffer} {currency.symbol}
                    </span>
                  </div>
                </div>

                {/* AI Recommendation Banner */}
                <div className={`p-3.5 rounded-xl text-xs font-semibold border ${
                  netProfitAtOffer >= 5 && marginAtOffer >= 30
                    ? 'bg-teal-50 text-teal-900 border-teal-200'
                    : netProfitAtOffer > 0 && marginAtOffer >= 15
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                  <p className="font-bold mb-1">
                    {netProfitAtOffer >= 5 && marginAtOffer >= 30
                      ? t.recommendAccept
                      : netProfitAtOffer > 0 && marginAtOffer >= 15
                      ? `${t.recommendCounter} ${suggestedCounterOffer} ${currency.symbol}`
                      : t.recommendReject}
                  </p>
                  <p className="text-3xs opacity-80">
                    {lang === 'fr'
                      ? 'Sur Vinted, aucune commission n\'est déduite du vendeur. Ce profit est 100% net dans votre poche.'
                      : 'في منصة Vinted لا تُقتطع أي عمولة من البائع (0%)، لذا هذا الربح هو صافٍ تماماً في جيبك.'}
                  </p>
                </div>

                {/* Copyable Counter Offer message */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-xs text-slate-600 font-medium truncate">
                    {lang === 'fr' ? 'Message de contre-offre prêt à l\'envoi :' : 'رسالة تفاوض جاهزة للنسخ لـ Vinted:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCounterMessage}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedCounterMsg ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCounterMsg ? (lang === 'fr' ? 'Copié !' : 'تم النسخ!') : (lang === 'fr' ? 'Copier le message' : 'نسخ الرسالة')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {activeTab === 'scanner'
              ? (lang === 'fr' ? 'Détection haute vitesse (Code 128, 39, EAN, QR)' : 'قراءة فائقة السرعة لكافة أنواع الباركود وQR وSKU')
              : (lang === 'fr' ? 'Négociation intelligente Vinted 0% frais vendeur' : 'تفاوض ذكي مع عمولة 0% على البائع في Vinted')}
          </span>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
