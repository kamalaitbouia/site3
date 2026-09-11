import React, { useState } from 'react';
import { Lock, Delete } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface PinAuthModalProps {
  onUnlock: () => void;
}

export const PinAuthModal: React.FC<PinAuthModalProps> = ({ onUnlock }) => {
  const { lang } = useI18n();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const CORRECT_PIN = "041994";

  const handlePress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 6) {
        if (newPin === CORRECT_PIN) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6 border border-slate-100">
          <Lock className="w-7 h-7" />
        </div>
        
        <h2 className="text-xl font-black text-slate-900 mb-2">
          {lang === 'fr' ? 'Système Verrouillé' : 'النظام مقفل'}
        </h2>
        <p className="text-sm font-medium text-slate-500 mb-8 text-center">
          {lang === 'fr' ? 'Veuillez entrer votre code PIN' : 'الرجاء إدخال الرمز السري للوصول إلى بياناتك'}
        </p>

        {/* Dots */}
        <div className={`flex gap-3 mb-8 ${error ? 'animate-shake' : ''}`}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length 
                  ? (error ? 'bg-rose-500 border-rose-500' : 'bg-slate-800 border-slate-800') 
                  : 'bg-slate-100 border-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full" dir="ltr">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="h-14 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 active:bg-slate-200 flex items-center justify-center text-2xl font-black text-slate-800 transition"
            >
              {num}
            </button>
          ))}
          <div /> {/* Empty space */}
          <button
            onClick={() => handlePress('0')}
            className="h-14 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 active:bg-slate-200 flex items-center justify-center text-2xl font-black text-slate-800 transition"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 sm:h-16 rounded-2xl bg-rose-50/50 text-rose-500 hover:bg-rose-100 active:bg-rose-200 flex items-center justify-center transition"
          >
            <Delete className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
