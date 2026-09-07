import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Language } from '../lib/translations';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'inline' | 'compact';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'navbar' }) => {
  const { lang, setLang } = useI18n();

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'fr' : 'ar');
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200/90 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        title={lang === 'ar' ? 'Passer en Français' : 'التحويل إلى العربية'}
      >
        <span>{lang === 'ar' ? '🇫🇷 FR' : '🇸🇦 AR'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/80">
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs sm:text-xs font-bold transition cursor-pointer ${
          lang === 'ar'
            ? 'bg-white text-teal-700 shadow-2xs'
            : 'text-slate-500 hover:text-slate-900'
        }`}
        title="العربية"
      >
        <span>🇸🇦</span>
        <span>عربي</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('fr')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs sm:text-xs font-bold transition cursor-pointer ${
          lang === 'fr'
            ? 'bg-white text-teal-700 shadow-2xs'
            : 'text-slate-500 hover:text-slate-900'
        }`}
        title="Français"
      >
        <span>🇫🇷</span>
        <span>FR</span>
      </button>
    </div>
  );
};
