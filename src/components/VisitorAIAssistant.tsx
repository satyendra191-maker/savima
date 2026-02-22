
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minus, Maximize2, MessageCircle, CheckCircle, Sparkles, GripVertical, Phone, Building2, Mail, Package, Paperclip, FileText, XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { chatWithSalesAI } from '../lib/gemini';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLeadCaptured?: boolean;
}

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  product?: string;
  details?: string;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = 'saviman-visitor-ai-position';

export const VisitorAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
  
  const [messages, setMessages] = useState<Message[]>([
    { 
        id: '0', 
        role: 'model', 
        text: "Hello! 👋 I'm your **Sales Engineer** at SAVIMAN.\n\nI can help you with:\n\n🔩 Product specifications\n💰 Get instant quotes\n📐 Technical drawings\n🏭 Manufacturing capabilities\n📦 Order samples\n\nTo serve you better, please share your details:\n\n**Your Name?**"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadStep, setLeadStep] = useState<'name' | 'email' | 'phone' | 'company' | 'product' | 'complete'>('name');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
          notes: `[AI Chatbot Lead]\nProduct Interest: ${lead.product || 'General'}\nDetails: ${lead.details || 'N/A'}`
        }]);

      if (error) {
        console.error('Error saving lead:', error);
      }
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

    // Lead capture flow
    if (leadStep !== 'complete') {
      const updatedLead = { ...leadData };
      
      if (leadStep === 'name') {
        updatedLead.name = input;
        setLeadData(updatedLead);
        setLeadStep('email');
        
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: "Thank you! Now, please share your **Email address**?" 
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
          text: "Great! What is your **Phone number**?" 
        }]);
        setLoading(false);
        return;
      }

      if (leadStep === 'phone') {
        updatedLead.phone = input;
        setLeadData(updatedLead);
        setLeadStep('company');
        
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: "Perfect! Which **Company** do you work with?" 
        }]);
        setLoading(false);
        return;
      }

      if (leadStep === 'company') {
        updatedLead.company = input;
        setLeadData(updatedLead);
        setLeadStep('product');
        
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: "Excellent! What **product** are you interested in?\n\nYou can describe it or choose from:\n• Brass Components\n• SS Components\n• Machinery Components\n• Custom Parts" 
        }]);
        setLoading(false);
        return;
      }

      if (leadStep === 'product') {
        updatedLead.product = input;
        setLeadData(updatedLead);
        setLeadStep('complete');
        
        // Save lead to Supabase
        await saveLeadToSupabase(updatedLead);
        
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: `Thank you, **${updatedLead.name}**! 🎉\n\nYour information has been saved. Our engineering team will contact you at **${updatedLead.phone}** or **${updatedLead.email}** regarding **${updatedLead.product}**.\n\nNow, how can I help you today? Feel free to ask about:\n• Technical specifications\n• Pricing & quotes\n• Lead times\n• Custom manufacturing`,
          isLeadCaptured: true
        }]);
        setLoading(false);
        return;
      }
    }

    // Pass chat to AI for responses as engineer
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
        const responseText = await chatWithSalesAI(history);
        
        const botMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: responseText
        };
        
        setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error("Chat Error:", error);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: "I apologize, but I encountered a connection issue. Please try again or contact us directly at export@saviman.com" 
        }]);
    } finally {
        setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: "File is too large. Maximum size is 10MB." 
        }]);
        return;
      }
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full shadow-elevated flex items-center justify-center text-white border-4 border-white transition-transform transform group-hover:scale-105">
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
      className="fixed z-[100] flex flex-col bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border-2 border-primary-500 font-sans animate-fade-in-up select-none"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? 'auto' : 'min(420px, calc(100vw - 40px))',
        height: isMinimized ? 'auto' : 'min(600px, calc(100vh - 100px))',
        boxShadow: isDragging 
          ? '0 8px 40px rgba(0, 123, 255, 0.4)' 
          : '0 4px 24px rgba(0, 123, 255, 0.2)'
      }}
    >
      {/* Header - Draggable */}
      <div 
        className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 flex justify-between items-center text-white cursor-move rounded-t-xl"
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
            <h3 className="font-bold text-base">Saviman Engineer AI</h3>
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
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-surface-dark border-2 border-primary-100 dark:border-primary-800 text-neutral-700 dark:text-neutral-200 rounded-tl-none'
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
                <div className="bg-white dark:bg-surface-dark border-2 border-primary-100 dark:border-primary-800 rounded-2xl rounded-tl-none p-4 shadow-soft flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-surface-dark border-t-2 border-primary-200 dark:border-primary-800 shadow-[0_-5px_15px_rgba(0,123,255,0.1)]">
            {/* Attachment Preview */}
            {attachment && (
              <div className="mb-2 flex items-center gap-2 p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-700">
                <FileText size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-xs text-neutral-700 dark:text-neutral-300 flex-1 truncate">{attachment.name}</span>
                <button onClick={removeAttachment} className="text-neutral-400 hover:text-red-500">
                  <XCircle size={16} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full border-2 border-primary-300 dark:border-primary-700 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 transition-all">
              <label className="p-2 text-neutral-500 hover:text-primary-500 cursor-pointer transition-colors no-drag">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.step,.stp,.dwg,.dxf,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileSelect}
                />
                <Paperclip size={18} />
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={leadStep !== 'complete' ? `Enter your ${leadStep}...` : 'Ask about products, quotes, specifications...'}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()} 
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white p-2.5 rounded-full transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
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
