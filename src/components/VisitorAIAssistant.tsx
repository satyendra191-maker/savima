
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Minus, Maximize2, Sparkles, CheckCircle, FileText, XCircle, Globe, Phone, Building2, Mail, Package } from 'lucide-react';
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

const STORAGE_KEY = 'saviman-visitor-ai-position';

const COMPANY_INFO = {
  name: 'Saviman Precision Manufacturing Pvt Ltd',
  location: 'Jamnagar, Gujarat, India',
  specialties: 'High-precision CNC Turning, CNC Milling, VMC, 5-Axis Machining',
  tolerances: '±0.005 mm',
  materials: 'Aluminium (6061/7075), Stainless Steel (304/316), Mild Steel, Brass, Copper, Titanium, Engineering Plastics',
  industries: 'Automotive, Aerospace, Defense, Medical Devices, Electronics, Oil & Gas',
  usp: 'German/Japanese machines, ISO-quality systems, fast turnaround (7-15 days), competitive Indian pricing'
};

const LANGUAGE_GREETINGS: Record<string, string> = {
  en: "Hello! 👋 I'm Saviman AI, your expert for precision machined components. How can I help you today?",
  hi: "नमस्ते! 👋 मैं Saviman AI हूं, प्रिसिजन मशीन्ड कंपोनेंट्स के लिए आपका विशेषज्ञ। मैं आपकी कैसे मदद कर सकता हूं?",
  es: "¡Hola! 👋 Soy Saviman AI, su experto en componentes mecanizados de precisión. ¿Cómo puedo ayudarle?",
  de: "Hallo! 👋 Ich bin Saviman AI, Ihr Experte für präzise Maschinenteile. Wie kann ich Ihnen helfen?",
  fr: "Bonjour! 👋 Je suis Saviman AI, votre expert en composants usinés de précision. Comment puis-je vous aider?",
  pt: "Olá! 👋 Sou o Saviman AI, seu especialista em componentes usinados de precisão. Como posso ajudar?",
  ar: "مرحباً! 👋 أنا Saviman AI، خبيرك في المكونات الآلية الدقيقة. كيف يمكنني مساعدتك؟",
  zh: "你好! 👋 我是Saviman AI，您的精密加工组件专家。我能为您提供什么帮助？",
  ja: "こんにちは! 👋 Saviman AIです。精密加工部品の専門家ですございます有哪些可以帮助您的？",
  ko: "안녕하세요! 👋 Saviman AI입니다. 정밀 가공 부품 전문가입니다. 어떻게 도와드릴까요?",
  ru: "Привет! 👋 Я Saviman AI, ваш эксперт по прецизионным обработанным компонентам. Чем могу помочь?",
  it: "Ciao! 👋 Sono Saviman AI, il tuo esperto di componenti meccanici di precisione. Come posso aiutarti?",
  tr: "Merhaba! 👋 Saviman AI'yım, hassas işlenmiş bileşenler konusunda uzmanım. Nasıl yardımcı olabilirim?",
  nl: "Hallo! 👋 Ik ben Saviman AI, uw expert voor precisie machined onderdelen. Hoe kan ik u helpen?",
  pl: "Cześć! 👋 Jestem Saviman AI, ekspertem od precyzyjnych komponentów maszynowych. Jak mogę Ci pomóc?",
  vi: "Xin chào! 👋 Tôi là Saviman AI, chuyên gia về các thành phần gia công chính xác. Tôi có thể giúp gì cho bạn?",
  th: "สวัสดี! 👋 ฉันคือ Saviman AI ผู้เชี่ยวชาญด้านชิ้นส่วนเครื่องจักรความแม่นยำสูง ฉันจะช่วยคุณได้อย่างไร?",
  id: "Halo! 👋 Saya Saviman AI, ahli komponen mesin presisi. Bagaimana saya bisa membantu Anda?",
  ms: "Halo! 👋 Saya Saviman AI, pakar komponen mesin berpresisi. Bagaimana saya boleh membantu?"
};

const detectLanguage = (text: string): string => {
  const hindiChars = /[\u0900-\u097F]/;
  const arabicChars = /[\u0600-\u06FF]/;
  const chineseChars = /[\u4E00-\u9FFF]/;
  const japaneseChars = /[\u3040-\u309F\u30A0-\u30FF]/;
  const koreanChars = /[\uAC00-\uD7AF\u1100-\u11FF]/;
  const russianChars = /[\u0400-\u04FF]/;
  const spanishChars = /[áéíóúüñ¿¡]/i;
  const germanChars = /[äöüß]/i;
  const frenchChars = /[àâäçéèêëîïôûùüÿœæ]/i;
  const portugueseChars = /[ãõç]/i;
  const vietnameseChars = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộùúủũụưừứửữựỳýỷỹỵđ]/i;
  const thaiChars = /[\u0E00-\u0E7F]/;
  const indonesianChars = /[àáâãäåæçèéêëìíîï]/i;

  if (hindiChars.test(text)) return 'hi';
  if (arabicChars.test(text)) return 'ar';
  if (chineseChars.test(text)) return 'zh';
  if (japaneseChars.test(text)) return 'ja';
  if (koreanChars.test(text)) return 'ko';
  if (russianChars.test(text)) return 'ru';
  if (spanishChars.test(text)) return 'es';
  if (germanChars.test(text)) return 'de';
  if (frenchChars.test(text)) return 'fr';
  if (portugueseChars.test(text)) return 'pt';
  if (vietnameseChars.test(text)) return 'vi';
  if (thaiChars.test(text)) return 'th';
  if (indonesianChars.test(text)) return 'id';

  return 'en';
};

const getGreeting = (lang: string): string => {
  return LANGUAGE_GREETINGS[lang] || LANGUAGE_GREETINGS['en'];
};

export const VisitorAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [detectedLang, setDetectedLang] = useState('en');
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number' && 
            parsed.x >= 0 && parsed.y >= 0) {
          return parsed;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return { x: window.innerWidth - 80, y: window.innerHeight - 100 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const updatePosition = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: newX, y: newY }));
  };

  const initialGreeting = getGreeting(detectedLang);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '0', 
      role: 'model', 
      text: initialGreeting
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadStep, setLeadStep] = useState<'name' | 'company' | 'email' | 'phone' | 'requirements' | 'complete'>('name');
  const [attachment, setAttachment] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      updatePosition(newX, newY);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isDragging, dragStart]);

  const saveLeadToSupabase = async (lead: LeadData) => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: lead.name || 'Anonymous',
          email: lead.email || 'pending@saviman.com',
          phone: lead.phone || 'Not Provided',
          company: lead.company || 'Not Provided',
          source: 'AI Chatbot',
          status: 'new',
          notes: `[AI Chatbot Lead]\nCompany: ${lead.company || 'N/A'}\nRequirements: ${lead.requirements || 'N/A'}\nLanguage: ${detectedLang}`
        }]);

      if (error) {
        console.error('Error saving lead:', error);
      }
    } catch (error) {
      console.error('Lead save error:', error);
    }
  };

  const getPromptForStep = (step: string): string => {
    const prompts: Record<string, Record<string, string>> = {
      name: {
        en: "Great! Now, may I know your **Company Name**?",
        hi: "बहुत अच्छे! अब, क्या मैं आपकी **कंपनी का नाम** जान सकता हूं?",
        es: "¡Excelente! Ahora, ¿cuál es el nombre de su **empresa**?",
        de: "Großartig! Wie lautet der Name Ihres **Unternehmens**?",
        fr: "Excellent! Quel est le nom de votre **entreprise**?",
        zh: "太好了！请问您的**公司名称**是什么？"
      },
      company: {
        en: "Perfect! Please share your **Email Address** for the quote.",
        hi: "परफेक्ट! कोट के लिए कृपया अपना **ईमेल पता** साझा करें।",
        es: "¡Perfecto! Comparta su **correo electrónico** para la cotización.",
        de: "Perfekt! Bitte teilen Sie Ihre **E-Mail-Adresse** für das Angebot mit.",
        fr: "Parfait! Veuillez partager votre **adresse e-mail** pour le devis.",
        zh: "完美！请提供您的**电子邮件地址**以便发送报价。"
      },
      email: {
        en: "Thank you! Lastly, your **Phone Number** with country code (e.g., +91 98765 43210)?",
        hi: "धन्यवाद! अंत में, आपका **फोन नंबर** देश कोड के साथ (जैसे, +91 98765 43210)?",
        es: "¡Gracias! Finalmente, su **número de teléfono** con código de país?",
        de: "Vielen Dank! Ihre **Telefonnummer** mit Ländercode?",
        fr: "Merci! Votre **numéro de téléphone** avec l'indicatif du pays?",
        zh: "谢谢！最后，您的**电话号码**（带国家代码）？"
      },
      phone: {
        en: "Excellent! Now please describe your **requirements** (part name, material, quantity, tolerance, deadline).",
        hi: "उत्कृष्ट! अब कृपया अपनी **आवश्यकताओं** का वर्णन करें (भाग का नाम, सामग्री, मात्रा, टॉलरेंस, समय सीमा)।",
        es: "¡Excelente! Ahora describa sus **requisitos** (nombre de la pieza, material, cantidad, tolerancia, plazo).",
        de: "Ausgezeichnet! Bitte beschreiben Sie Ihre **Anforderungen**.",
        fr: "Excellent! Décrivez vos **exigences** (nom de la pièce, matière, quantité, tolérance, délai).",
        zh: "太好了！现在请描述您的**需求**（零件名称、材料、数量、公差、期限）。"
      }
    };
    return prompts[step]?.[detectedLang] || prompts[step]?.['en'] || prompts['name']['en'];
  };

  const getCompletionMessage = (): string => {
    const messages: Record<string, string> = {
      en: "Thank you! 🎉 Our engineering team will contact you within 4-6 hours with your quote. In the meantime, feel free to explore our capabilities at saviman.vercel.app",
      hi: "धन्यवाद! 🎉 हमारी इंजीनियरिंग टीम 4-6 घंटों के भीतर आपसे संपर्क करेगी। इस बीच, हमारी क्षमताओं का अन्वेषण करें।",
      es: "¡Gracias! 🎉 Nuestro equipo de ingeniería le contactará en 4-6 horas con su cotización.",
      de: "Vielen Dank! 🎉 Unser Engineering-Team wird Sie innerhalb von 4-6 Stunden mit Ihrem Angebot kontaktieren.",
      fr: "Merci! 🎉 Notre équipe d'ingénierie vous contactera sous 4 à 6 heures avec votre devis.",
      zh: "谢谢！🎉 我们的工程团队将在4-6小时内联系您并提供报价。"
    };
    return messages[detectedLang] || messages['en'];
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Detect language from user input
    const lang = detectLanguage(input);
    if (lang !== detectedLang && lang !== 'en') {
      setDetectedLang(lang);
    }

    // Lead capture flow
    if (leadStep !== 'complete') {
      const updatedLead = { ...leadData };
      
      if (leadStep === 'name') {
        updatedLead.name = input;
        setLeadData(updatedLead);
        setLeadStep('company');
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: getPromptForStep('company')
        }]);
        setLoading(false);
        return;
      }
      
      if (leadStep === 'company') {
        updatedLead.company = input;
        setLeadData(updatedLead);
        setLeadStep('email');
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: getPromptForStep('email')
        }]);
        setLoading(false);
        return;
      }

      if (leadStep === 'email') {
        updatedLead.email = input;
        setLeadData(updatedLead);
        setLeadStep('phone');
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: getPromptForStep('phone')
        }]);
        setLoading(false);
        return;
      }

      if (leadStep === 'phone') {
        updatedLead.phone = input;
        setLeadData(updatedLead);
        setLeadStep('requirements');
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: getPromptForStep('requirements')
        }]);
        setLoading(false);
        return;
      }

      if (leadStep === 'requirements') {
        updatedLead.requirements = input;
        setLeadData(updatedLead);
        setLeadStep('complete');
        
        // Save lead to Supabase
        await saveLeadToSupabase(updatedLead);
        
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: getCompletionMessage(),
          isLeadCaptured: true
        }]);
        setLoading(false);
        return;
      }
    }

    // AI response for general queries
    const aiResponses: Record<string, string> = {
      en: `Thank you for your interest in Saviman! We're a precision CNC machining company in Jamnagar, Gujarat. We specialize in:\n\n🔩 **CNC Turning, Milling, VMC, 5-Axis**\n⚙️ **Tolerances**: ±0.005mm\n🏭 **Materials**: Aluminum, SS304/316, Brass, Titanium\n🚗 **Industries**: Automotive, Aerospace, Medical, Defense\n\nWould you like a quote? Please share:\n• Part name/drawing\n• Material required\n• Quantity needed\n• Tolerance specifications\n• Your deadline`,
      hi: `Saviman में आपकी रुचि के लिए धन्यवाद! हम Jamnagar, Gujarat में प्रिसिजन CNC मशीनिंग कंपनी हैं।\n\n🔩 **CNC टर्निंग, मिलिंग, VMC, 5-एक्सिस**\n⚙️ **टॉलरेंस**: ±0.005mm\n🏭 **सामग्री**: एल्युमीनियम, SS304/316, ब्रास, टाइटेनियम\n\nक्या आप कोट चाहेंगे?`,
      es: `¡Gracias por su interés en Saviman! Somos una empresa de mecanizado CNC de precisión en Jamnagar, Gujarat.`,
      de: `Vielen Dank für Ihr Interesse an Saviman! Wir sind ein Präzisions-CNC-Unternehmen in Jamnagar, Gujarat.`,
      fr: `Merci pour votre intérêt pour Saviman! Nous sommes une entreprise de usinage CNC de précision à Jamnagar, Gujarat.`,
      zh: `感谢您对Saviman的关注！我们是古吉拉特邦Jamnagar的精密CNC加工公司。`
    };

    const response = aiResponses[detectedLang] || aiResponses['en'];
    
    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response
    }]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <div
        className="fixed z-[100] select-none"
        style={{ 
          left: position.x, 
          top: position.y
        }}
      >
        <div 
          className="cursor-move"
          onMouseDown={handleMouseDown}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
            className="w-14 h-14 group relative flex items-center justify-center cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-ping opacity-30"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-elevated flex items-center justify-center text-white border-4 border-white transition-transform transform group-hover:scale-105">
              <Sparkles size={24} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Chat window when open
  return (
    <div
      ref={containerRef}
      className="fixed z-[100] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500 font-sans animate-fade-in-up select-none"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? 'auto' : 'min(420px, calc(100vw - 40px))',
        height: isMinimized ? 'auto' : 'min(600px, calc(100vh - 100px))',
        boxShadow: isDragging 
          ? '0 8px 40px rgba(212, 175, 55, 0.4)' 
          : '0 4px 24px rgba(212, 175, 55, 0.2)'
      }}
    >
      {/* Header - Draggable */}
      <div 
        className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex justify-between items-center text-white cursor-move rounded-t-xl"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/20">
              <Sparkles size={24} className="text-white"/>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-base">Saviman AI</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 no-drag">
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900/50 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm whitespace-pre-wrap ${msg.role === 'user' 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900 text-neutral-700 dark:text-neutral-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                {msg.isLeadCaptured && (
                  <div className="mt-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg border-2 border-green-200 dark:border-green-800 flex items-center gap-2 animate-fade-in shadow-soft w-full">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0"/>
                    <div>
                      <span className="font-bold block">Lead Captured Successfully!</span>
                      <span className="text-[10px] opacity-80">Our engineer will contact you shortly.</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900 rounded-2xl rounded-tl-none p-4 shadow-soft flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t-2 border-amber-200 dark:border-amber-800 shadow-[0_-5px_15px_rgba(212,175,55,0.1)]">
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-full border-2 border-amber-300 dark:border-amber-700 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={leadStep !== 'complete' ? `Enter your ${leadStep}...` : 'Ask about our services, quotes, specifications...'}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()} 
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white p-2.5 rounded-full transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} className="ml-0.5" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisitorAIAssistant;
