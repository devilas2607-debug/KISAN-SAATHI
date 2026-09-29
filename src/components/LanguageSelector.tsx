import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, AVAILABLE_LANGUAGES, Language } from '../translations/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface Props {
  variant?: 'header' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<Props> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentOption = AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      id="language-selector-wrapper"
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger Button: 🌐 Language / current */}
      <button
        type="button"
        id="btn-language-selector"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select Language / भाषा चुनें"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200/90 text-stone-800 border border-stone-300 shadow-2xs transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
      >
        <span className="text-base leading-none select-none" role="img" aria-label="Globe">
          🌐
        </span>
        <span className="text-stone-700 font-semibold">{t('nav.language')}:</span>
        <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
          {currentOption.nativeName}
          {currentOption.code !== 'en' && (
            <span className="text-[10px] text-stone-400 font-normal ml-1">({currentOption.name})</span>
          )}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-700' : ''
          }`}
        />
      </button>

      {/* Accessible native select for screen readers / mobile quick pick */}
      <label htmlFor="native-language-select" className="sr-only">
        {t('nav.language')}
      </label>
      <select
        id="native-language-select"
        value={language}
        onChange={(e) => handleSelectLanguage(e.target.value as Language)}
        className="sr-only"
        tabIndex={-1}
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} — {lang.name} {lang.dir === 'rtl' ? '(RTL)' : ''}
          </option>
        ))}
      </select>

      {/* Dropdown Menu listing all 13 official languages */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="btn-language-selector"
          className="absolute right-0 mt-1.5 w-64 max-h-[80vh] overflow-y-auto rounded-2xl bg-white border border-stone-200 shadow-xl z-50 p-1.5 divide-y divide-stone-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Menu Header */}
          <div className="px-3 py-2 text-[11px] font-bold text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-stone-700">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('nav.language')} / Language Selection</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
              13 Languages
            </span>
          </div>

          {/* Language Options List */}
          <div className="py-1">
            {AVAILABLE_LANGUAGES.map((item, index) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  id={`btn-lang-${item.code}`}
                  role="menuitem"
                  type="button"
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-stone-400 w-4 text-right">
                      {index + 1}.
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-stone-900 leading-tight">
                        {item.nativeName}
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        {item.name} {item.dir === 'rtl' ? '• RTL' : ''}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
