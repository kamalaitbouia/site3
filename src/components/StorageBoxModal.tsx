import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  X, 
  Check, 
  Trash2, 
  Layers, 
  MapPin, 
  Palette, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { StorageBox } from '../types';
import { useI18n } from '../lib/i18n';

interface StorageBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (box: StorageBox, updateLinkedProducts: boolean, oldName?: string) => void;
  onDelete?: (boxId: string, boxName: string) => void;
  boxToEdit?: StorageBox | null;
  itemsCountInBox?: number;
  existingBoxes: StorageBox[];
}

const COLOR_OPTIONS = [
  { id: 'amber', nameAr: 'عنبري دافئ', nameFr: 'Ambre', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
  { id: 'teal', nameAr: 'تيل فيروزي', nameFr: 'Teal', bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500' },
  { id: 'emerald', nameAr: 'أخضر زمردي', nameFr: 'Émeraude', bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' },
  { id: 'indigo', nameAr: 'نيلي داكن', nameFr: 'Indigo', bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500' },
  { id: 'rose', nameAr: 'وردي ياقوتي', nameFr: 'Rose', bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
  { id: 'blue', nameAr: 'أزرق كلاسيكي', nameFr: 'Bleu', bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
  { id: 'purple', nameAr: 'أرجواني', nameFr: 'Violet', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
  { id: 'slate', nameAr: 'رمادي حجري', nameFr: 'Ardoise', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500' },
];

const PRESET_NAMES = [
  'صندوق A1',
  'صندوق A2',
  'صندوق B1',
  'صندوق B2',
  'صندوق C1',
  'رف 1',
  'رف 2',
  'شماعة الملابس 1',
];

const PRESET_ZONES = [
  'غرفة المخزن',
  'الرف العلوي',
  'الرف الأوسط',
  'الرف السفلي',
  'المرآب',
  'الخزانة الرئيسية',
];

export const StorageBoxModal: React.FC<StorageBoxModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  boxToEdit,
  itemsCountInBox = 0,
  existingBoxes,
}) => {
  const { t, lang } = useI18n();

  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [color, setColor] = useState('amber');
  const [capacity, setCapacity] = useState<number | ''>(20);
  const [notes, setNotes] = useState('');
  const [updateLinked, setUpdateLinked] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (boxToEdit) {
      setName(boxToEdit.name || '');
      setZone(boxToEdit.zone || '');
      setColor(boxToEdit.color || 'amber');
      setCapacity(boxToEdit.capacity || '');
      setNotes(boxToEdit.notes || '');
      setUpdateLinked(true);
      setErrorMessage('');
    } else {
      // Suggest next box name based on existing count
      const nextNum = existingBoxes.length + 1;
      setName(`صندوق A${nextNum}`);
      setZone(PRESET_ZONES[0]);
      setColor(COLOR_OPTIONS[(nextNum - 1) % COLOR_OPTIONS.length].id);
      setCapacity(20);
      setNotes('');
      setUpdateLinked(true);
      setErrorMessage('');
    }
  }, [boxToEdit, isOpen, existingBoxes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage(t.boxNameLabel + ' مطلوب');
      return;
    }

    // Check if name conflicts with another box
    const duplicate = existingBoxes.find(
      (b) => b.name.toLowerCase() === cleanName.toLowerCase() && b.id !== boxToEdit?.id
    );
    if (duplicate) {
      setErrorMessage(lang === 'fr' ? 'Ce nom de boîte existe déjà !' : 'يوجد صندوق آخر بنفس هذا الاسم بالفعل!');
      return;
    }

    const boxData: StorageBox = {
      id: boxToEdit ? boxToEdit.id : `box-${Date.now()}`,
      name: cleanName,
      zone: zone.trim() || undefined,
      color: color || 'amber',
      capacity: capacity ? Number(capacity) : undefined,
      notes: notes.trim() || undefined,
      createdAt: boxToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(boxData, updateLinked, boxToEdit ? boxToEdit.name : undefined);
    onClose();
  };

  const handleDelete = () => {
    if (!boxToEdit || !onDelete) return;
    if (itemsCountInBox > 0) {
      alert(t.boxHasItemsWarning);
      return;
    }
    if (confirm(t.deleteBoxConfirm)) {
      onDelete(boxToEdit.id, boxToEdit.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {boxToEdit ? t.editStorageBoxTitle : t.newStorageBoxTitle}
              </h2>
              <p className="text-2xs text-slate-500">
                {boxToEdit ? `${itemsCountInBox} ${t.itemsInBox}` : t.storageLocationsDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Box Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.boxNameLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMessage('');
              }}
              placeholder={t.boxNamePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-amber-500 focus:bg-white"
            />
            {/* Quick Name Presets */}
            {!boxToEdit && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {PRESET_NAMES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setName(preset)}
                    className="text-3xs font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zone / Room */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.boxZoneLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder={t.boxZonePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
              />
            </div>
            {/* Quick Zone Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              {PRESET_ZONES.map((pz) => (
                <button
                  key={pz}
                  type="button"
                  onClick={() => setZone(pz)}
                  className={`text-3xs font-semibold px-2 py-1 rounded-lg transition ${
                    zone === pz
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.boxColorLabel}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${c.bg} shrink-0`} />
                    <span className="truncate text-3xs">
                      {lang === 'fr' ? c.nameFr : c.nameAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.boxCapacityLabel}
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 20 قطعة"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.boxNotesLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.boxNotesPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white resize-none"
            />
          </div>

          {/* Option to rename linked products when editing */}
          {boxToEdit && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updateLinked}
                  onChange={(e) => setUpdateLinked(e.target.checked)}
                  className="mt-0.5 rounded-sm text-amber-600 focus:ring-amber-500"
                />
                <span className="text-2xs text-amber-900 font-medium leading-relaxed">
                  {t.updateLinkedProducts} ({itemsCountInBox} قطع)
                </span>
              </label>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {boxToEdit && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                title={t.deleteBoxBtn}
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.deleteBoxBtn}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{boxToEdit ? t.updateBoxBtn : t.saveBoxBtn}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
