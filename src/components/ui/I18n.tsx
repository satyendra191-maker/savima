import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations, Language, TranslationKeys } from '../../lib/i18n';
import { Globe, ChevronDown, Search, X } from 'lucide-react';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved && translations[saved as Language]) ? saved as Language : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used within I18nProvider');
  return context;
};

// ─────────────────────────────────────────────────────────
// 100+ Language data for the Google Translate widget
// ─────────────────────────────────────────────────────────
const ALL_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', flag: '🇹🇼' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'th', name: 'Thai', native: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Filipino', native: 'Filipino', flag: '🇵🇭' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақша', flag: '🇰🇿' },
  { code: 'uz', name: 'Uzbek', native: "O'zbek", flag: '🇺🇿' },
  { code: 'tk', name: 'Turkmen', native: 'Türkmençe', flag: '🇹🇲' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол', flag: '🇲🇳' },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', native: 'ພາສາລາວ', flag: '🇱🇦' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာဘာသာ', flag: '🇲🇲' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
  { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇦🇫' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰' },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргыз', flag: '🇰🇬' },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'be', name: 'Belarusian', native: 'Беларуская', flag: '🇧🇾' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦' },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'eu', name: 'Basque', native: 'Euskara', flag: '🇪🇸' },
  { code: 'ca', name: 'Catalan', native: 'Català', flag: '🇪🇸' },
  { code: 'gl', name: 'Galician', native: 'Galego', flag: '🇪🇸' },
  { code: 'eo', name: 'Esperanto', native: 'Esperanto', flag: '🌐' },
  { code: 'la', name: 'Latin', native: 'Latina', flag: '🏛️' },
  { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl', flag: '🇭🇹' },
  { code: 'jw', name: 'Javanese', native: 'Basa Jawa', flag: '🇮🇩' },
  { code: 'ceb', name: 'Cebuano', native: 'Cebuano', flag: '🇵🇭' },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy', flag: '🇲🇬' },
  { code: 'ny', name: 'Chichewa', native: 'Chichewa', flag: '🇲🇼' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', flag: '🇿🇦' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho', flag: '🇱🇸' },
  { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'sn', name: 'Shona', native: 'chiShona', flag: '🇿🇼' },
  { code: 'mi', name: 'Maori', native: 'Te Reo Māori', flag: '🇳🇿' },
  { code: 'sm', name: 'Samoan', native: 'Gagana Samoa', flag: '🇼🇸' },
  { code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch', flag: '🇱🇺' },
  { code: 'fy', name: 'Frisian', native: 'Frysk', flag: '🇳🇱' },
  { code: 'yi', name: 'Yiddish', native: 'ייִדיש', flag: '🇮🇱' },
  { code: 'ku', name: 'Kurdish', native: 'Kurdî', flag: '🇮🇶' },
  { code: 'ckb', name: 'Sorani', native: 'سۆرانی', flag: '🇮🇶' },
  { code: 'dv', name: 'Maldivian', native: 'Divehi', flag: '🇲🇻' },
  { code: 'fy', name: 'Frisian', native: 'Frysk', flag: '🇳🇱' },
  { code: 'se', name: 'Sami', native: 'Sámegiella', flag: '🇸🇪' },
  { code: 'oj', name: 'Ojibwe', native: 'Ojibwemowin', flag: '🇨🇦' },
  { code: 'ik', name: 'Inupiaq', native: 'Iñupiaq', flag: '🇺🇸' },
  { code: 'iu', name: 'Inuktitut', native: 'ᐃᓄᒃᑎᑐᑦ', flag: '🇨🇦' },
  { code: 'gn', name: 'Guarani', native: 'Guarani', flag: '🇵🇾' },
  { code: 'qu', name: 'Quechua', native: 'Quechua', flag: '🇵🇪' },
  { code: 'ay', name: 'Aymara', native: 'Aymara', flag: '🇧🇴' },
  { code: 'tt', name: 'Tatar', native: 'Татар', flag: '🇷🇺' },
  { code: 'ba', name: 'Bashkir', native: 'Башҡорт', flag: '🇷🇺' },
  { code: 'kv', name: 'Komi', native: 'Коми', flag: '🇷🇺' },
  { code: 'ce', name: 'Chechen', native: 'Нохчийн', flag: '🇷🇺' },
  { code: 'cv', name: 'Chuvash', native: 'Чӑваш', flag: '🇷🇺' },
  { code: 'udm', name: 'Udmurt', native: 'Удмурт', flag: '🇷🇺' },
  { code: 'mhr', name: 'Mari', native: 'Марий', flag: '🇷🇺' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृत', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', native: 'कश्मीरी', flag: '🇮🇳' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন', flag: '🇮🇳' },
  { code: 'sat', name: 'Santali', native: 'सोंठ', flag: '🇮🇳' },
  { code: 'unk', name: 'Angika', native: 'अंगिका', flag: '🇮🇳' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी', flag: '🇮🇳' },
  { code: 'maithili', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳' },
  { code: 'bh', name: 'Bihari', native: 'भोजपुरी', flag: '🇮🇳' },
  { code: 'sm', name: 'Samoan', native: 'Gagana Samoa', flag: '🇼🇸' },
  { code: 'to', name: 'Tongan', native: 'lea faka-Tonga', flag: '🇹🇴' },
  { code: 'pih', name: 'Norfolk', native: 'Norfuk', flag: '🇳🇫' },
  { code: 'mi', name: 'Maori', native: 'Te Reo Māori', flag: '🇳🇿' },
  { code: 'haw', name: 'Hawaiian', native: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸' },
  { code: 'kl', name: 'Kalaallisut', native: 'Kalaallisut', flag: '🇬🇱' },
  { code: 'saq', name: 'Samburu', native: 'Kisamburu', flag: '🇰🇪' },
  { code: 'dav', name: 'Taita', native: 'Kitaita', flag: '🇰🇪' },
  { code: 'rof', name: 'Rongga', native: 'Kirongga', flag: '🇹🇿' },
  { code: 'kam', name: 'Kamba', native: 'Kikamba', flag: '🇰🇪' },
  { code: 'mer', name: 'Meru', native: 'Kimeru', flag: '🇰🇪' },
  { code: 'kln', name: 'Kalenjin', native: 'Naik', flag: '🇰🇪' },
  { code: 'luo', name: 'Luo', native: 'Dholuo', flag: '🇰🇪' },
  { code: 'luy', name: 'Luyia', native: 'Luluhia', flag: '🇰🇪' },
  { code: 'mas', name: 'Masai', native: 'Maa', flag: '🇰🇪' },
  { code: 'tpi', name: 'Tok Pisin', native: 'Tok Pisin', flag: '🇵🇬' },
  { code: 'ho', name: 'Hiri Motu', native: 'Hiri Motu', flag: '🇵🇬' },
  { code: 'kg', name: 'Kongo', native: 'Kongo', flag: '🇨🇩' },
  { code: 'ln', name: 'Lingala', native: 'Lingala', flag: '🇨🇩' },
  { code: 'rn', name: 'Kirundi', native: 'Rundi', flag: '🇧🇮' },
  { code: 'sg', name: 'Sango', native: 'Sängö', flag: '🇨🇫' },
  { code: 'swb', name: 'Comorian', native: 'Shikomori', flag: '🇾🇹' },
  { code: 'mfe', name: 'Mauritian Creole', native: 'Kreol Morisyen', flag: '🇲🇺' },
  { code: 'xog', name: 'Soga', native: 'Olusoga', flag: '🇺🇬' },
  { code: 'lg', name: 'Luganda', native: 'Luganda', flag: '🇺🇬' },
  { code: 'afa', name: 'Afro-Asiatic', native: 'Afro-Asiatic', flag: '🌍' },
  { code: 'nic', name: 'Niger-Congo', native: 'Niger-Congo', flag: '🌍' },
  { code: 'ssa', name: 'Nilo-Saharan', native: 'Nilo-Saharan', flag: '🌍' },
  { code: 'csu', name: 'Central Sudanic', native: 'Central Sudanic', flag: '🌍' },
];

// Trigger Google Translate to switch to a language code
function triggerGoogleTranslate(langCode: string) {
  const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (selectEl) {
    selectEl.value = langCode;
    selectEl.dispatchEvent(new Event('change'));
  }
}

export const LanguageSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(ALL_LANGUAGES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search.trim()
    ? ALL_LANGUAGES.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase())
    )
    : ALL_LANGUAGES;

  const selectLanguage = (lang: typeof ALL_LANGUAGES[0]) => {
    setSelected(lang);
    setOpen(false);
    setSearch('');
    triggerGoogleTranslate(lang.code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        title="Translate website"
      >
        <Globe size={16} className="text-brass-500" />
        <span className="hidden sm:inline max-w-[60px] truncate text-xs">{selected.flag} {selected.name}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[200] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                🌐 {ALL_LANGUAGES.length}+ Languages
              </span>
              <button onClick={() => { setOpen(false); setSearch(''); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X size={14} className="text-gray-500" />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search language…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-brass-500 outline-none"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-64 overflow-y-auto scrollbar-hide">
            {filtered.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">No language found</div>
            ) : (
              filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-brass-50 dark:hover:bg-brass-900/20 transition-colors text-sm ${selected.code === lang.code ? 'bg-brass-50 dark:bg-brass-900/20' : ''
                    }`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100 text-xs">{lang.name}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-[10px]">{lang.native}</div>
                  </div>
                  {selected.code === lang.code && (
                    <span className="ml-auto text-brass-600 text-xs font-black">✓</span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-[10px] text-gray-400 text-center">Powered by Google Translate</p>
          </div>
        </div>
      )}

      {/* Hidden Google Translate container */}
      <div id="google_translate_element" className="hidden" />
    </div>
  );
};
