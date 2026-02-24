'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLeadCaptured?: boolean;
}

interface LeadData {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  requirements?: string;
}

interface Position {
  x: number;
  y: number;
}

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      setCustomAttributes: (attributes: Record<string, unknown>) => void;
    };
  }
}

const STORAGE_KEY = 'saviman-chat-position';

const LANGUAGE_GREETINGS: Record<string, string> = {
  en: "Hello! 👋 I'm Saviman AI. How can I help you today?",
  hi: "नमस्ते! 👋 मैं Saviman AI हूं। मैं आपकी कैसे मदद कर सकता हूं?",
  es: "¡Hola! 👋 Soy Saviman AI. ¿Cómo puedo ayudarle?",
  de: "Hallo! 👋 Ich bin Saviman AI. Wie kann ich Ihnen helfen?",
  fr: "Bonjour! 👋 Je suis Saviman AI. Comment puis-je vous aider?",
  zh: "你好! 👋 我是Saviman AI。我能为您做些什么?",
  ar: "مرحباً! 👋 أنا Saviman AI. كيف يمكنني مساعدتك؟",
  ja: "こんにちは! 👋 Saviman AIです。何かお手伝いできますか？",
  ko: "안녕하세요! 👋 Saviman AI입니다. 무엇을 도와드릴까요?",
  pt: "Olá! 👋 Sou o Saviman AI. Como posso ajudar?",
  ru: "Привет! 👋 Я Saviman AI. Чем могу помочь?",
  it: "Ciao! 👋 Sono Saviman AI. Come posso aiutarti?",
  tr: "Merhaba! 👋 Ben Saviman AI. Nasıl yardımcı olabilirim?",
  nl: "Hallo! 👋 Ik ben Saviman AI. Hoe kan ik u helpen?",
  pl: "Cześć! 👋 Jestem Saviman AI. Jak mogę Ci pomóc?",
  vi: "Xin chào! 👋 Tôi là Saviman AI. Tôi có thể giúp gì cho bạn?",
  th: "สวัสดี! 👋 ฉันคือ Saviman AI ฉันจะช่วยคุณได้อย่างไร?",
  id: "Halo! 👋 Saya Saviman AI. Bagaimana saya bisa membantu?",
};

const detectLanguage = (text: string): string => {
  const patterns: { regex: RegExp; code: string }[] = [
    { regex: /[\u0900-\u097F]/, code: 'hi' },
    { regex: /[\u0600-\u06FF]/, code: 'ar' },
    { regex: /[\u4E00-\u9FFF]/, code: 'zh' },
    { regex: /[\u3040-\u309F\u30A0-\u30FF]/, code: 'ja' },
    { regex: /[\uAC00-\uD7AF]/, code: 'ko' },
    { regex: /[\u0400-\u04FF]/, code: 'ru' },
    { regex: /[áéíóúñ¿¡]/i, code: 'es' },
    { regex: /[äöüß]/i, code: 'de' },
    { regex: /[àâäçéèêëîïôûùüÿœæ]/i, code: 'fr' },
    { regex: /[ãõç]/i, code: 'pt' },
    { regex: /[\u0E00-\u0E7F]/, code: 'th' },
  ];

  for (const { regex, code } of patterns) {
    if (regex.test(text)) return code;
  }
  return 'en';
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [detectedLang, setDetectedLang] = useState('en');
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadStep, setLeadStep] = useState<'name' | 'company' | 'email' | 'phone' | 'requirements' | 'complete'>('name');
  const [chatwootLoaded, setChatwootLoaded] = useState(false);
  const [userCountry, setUserCountry] = useState('US');

  // Load position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPosition(parsed);
        }
      } catch {
        // Use default
      }
    }
  }, []);

  // Save position
  const updatePosition = (newPos: Position) => {
    setPosition(newPos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
  };

  // Initialize - detect language and try to load Chatwoot
  useEffect(() => {
    const init = async () => {
      // Detect language
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const country = data.country_code || 'US';
        setUserCountry(country);
        
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        const langCode = data.languages?.split(',')?.[0] || browserLang.split('-')[0] || 'en';
        setDetectedLang(langCode);
        
        setMessages([{ 
          id: '0', 
          role: 'model', 
          text: LANGUAGE_GREETINGS[langCode] || LANGUAGE_GREETINGS['en']
        }]);

        // Try to load Chatwoot
        initChatwoot(langCode, country);
      } catch {
        setDetectedLang('en');
        setMessages([{ 
          id: '0', 
          role: 'model', 
          text: LANGUAGE_GREETINGS['en']
        }]);
      }
    };

    init();
  }, []);

  const initChatwoot = (lang: string, country: string) => {
    // Skip if already loaded
    if (window.chatwootSDK) {
      setChatwootLoaded(true);
      return;
    }

    const CHATWOOT_URL = 'https://app.chatwoot.com';
    const CHATWOOT_TOKEN = 'YOUR_WEBSITE_TOKEN';

    try {
      window.chatwootSettings = {
        hideMessageBubble: false,
        position: 'right',
        type: 'standard',
        locale: lang,
      };

      const script = document.createElement('script');
      script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
      script.defer = true;
      script.async = true;
      
      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: CHATWOOT_TOKEN,
            baseUrl: CHATWOOT_URL,
          });
          setChatwootLoaded(true);

          setTimeout(() => {
            if (window.$chatwoot) {
              window.$chatwoot.setCustomAttributes({
                preferred_language: lang,
                country: country,
                source: 'saviman_website',
              });
            }
          }, 1500);
        }
      };

      script.onerror = () => {
        console.log('Chatwoot failed to load, using AI fallback');
        setChatwootLoaded(false);
      };

      document.body.appendChild(script);
    } catch (e) {
      console.log('Chatwoot initialization failed:', e);
    }
  };

  const getPromptForStep = (step: string): string => {
    const prompts: Record<string, Record<string, string>> = {
      name: { en: "Great! What's your **Company Name**?", hi: "बहुत अच्छे! आपकी कंपनी का नाम क्या है?" },
      company: { en: "Perfect! Your **Email Address**?", hi: "परफेक्ट! आपका ईमेल?" },
      email: { en: "Thank you! Your **Phone Number** with country code?", hi: "धन्यवाद! आपका फोन नंबर?" },
      phone: { en: "Excellent! Describe your **requirements** (material, quantity, tolerance, deadline).", hi: "उत्कृष्ट! अपनी आवश्यकताओं का वर्णन करें।" }
    };
    return prompts[step]?.[detectedLang] || prompts[step]?.['en'] || prompts['name']['en'];
  };

  const getCompletionMessage = (): string => {
    const messages: Record<string, string> = {
      en: "Thank you! 🎉 Our team will contact you within 4-6 hours.",
      hi: "धन्यवाद! 🎉 हमारी टीम 4-6 घंटों में संपर्क करेगी।",
      es: "¡Gracias! 🎉 Nuestro equipo le contactará en 4-6 horas.",
      de: "Vielen Dank! 🎉 Unser Team wird Sie in 4-6 Stunden kontaktieren.",
      fr: "Merci! 🎉 Notre équipe vous contactera sous 4 à 6 heures.",
      zh: "谢谢！🎉 我们的团队将在4-6小时内联系您。"
    };
    return messages[detectedLang] || messages['en'];
  };

  const saveLead = async (lead: LeadData) => {
    try {
      await supabase.from('leads').insert([{
        name: lead.name || 'Anonymous',
        email: lead.email || 'pending@saviman.com',
        phone: lead.phone || 'N/A',
        company: lead.company || 'N/A',
        source: 'AI Chat',
        status: 'new',
        notes: `Requirements: ${lead.requirements || 'N/A'}\nLanguage: ${detectedLang}`
      }]);
    } catch (error) {
      console.error('Lead save error:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Detect language from input
    const lang = detectLanguage(input);
    if (lang !== detectedLang) setDetectedLang(lang);

    // Lead capture flow
    if (leadStep !== 'complete') {
      const updated = { ...leadData };
      const currentStep = leadStep;
      
      if (leadStep === 'name') { updated.name = input; setLeadStep('company'); }
      else if (leadStep === 'company') { updated.company = input; setLeadStep('email'); }
      else if (leadStep === 'email') { updated.email = input; setLeadStep('phone'); }
      else if (leadStep === 'phone') { updated.phone = input; setLeadStep('requirements'); }
      else if (leadStep === 'requirements') { 
        updated.requirements = input; 
        setLeadStep('complete');
        await saveLead(updated);
      }
      
      setLeadData(updated);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: currentStep === 'requirements' ? getCompletionMessage() : getPromptForStep(currentStep),
        isLeadCaptured: currentStep === 'requirements'
      }]);
      setLoading(false);
      return;
    }

    // AI responses
    const responses: Record<string, string> = {
      en: `Thanks for your interest in Saviman! We're a precision CNC machining company in Jamnagar, Gujarat.\n\n🔩 **CNC Turning, Milling, VMC, 5-Axis**\n⚙️ **Tolerances**: ±0.005mm\n🏭 **Materials**: Aluminum, SS304/316, Brass, Titanium\n\nFor a quote, please share:\n• Part name/drawing\n• Material & quantity\n• Tolerance specs\n• Your deadline`,
      hi: `Saviman में आपकी रुचि के लिए धन्यवाद! हम Jamnagar, Gujarat में प्रिसिजन CNC कंपनी हैं।\n\n🔩 CNC टर्निंग, मिलिंग, VMC, 5-एक्सिस\n⚙️ टॉलरेंस: ±0.005mm`,
    };

    const response = responses[detectedLang] || responses['en'];
    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response
    }]);
    setLoading(false);
  };

  // If chatwoot loaded successfully, use it
  if (chatwootLoaded && !isOpen) {
    return null; // Chatwoot handles everything
  }

  // Floating button when closed
  if (!isOpen) {
    return (
      <div
        className="fixed z-[100]"
        style={{ left: position.x, top: position.y }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white animate-pulse hover:scale-110 transition-transform"
        >
          <Sparkles size={24} />
        </button>
      </div>
    );
  }

  // Chat window
  return (
    <div
      className="fixed z-[100] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500"
      style={{
        left: position.x,
        top: position.y,
        width: 'min(400px, calc(100vw - 40px))',
        height: isMinimized ? 'auto' : 'min(550px, calc(100vh - 80px))',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex justify-between items-center text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold">Saviman AI</h3>
            <p className="text-xs text-white/80">{chatwootLoaded ? 'Online' : 'AI Assistant'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/20 rounded-lg">
            {isMinimized ? '□' : '—'}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 flex gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={leadStep !== 'complete' ? `Your ${leadStep}...` : 'Ask about our services...'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-full"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
