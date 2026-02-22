
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minus, Maximize2, MessageCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { chatWithSalesAI } from '../lib/gemini';
import { InquiryService } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLeadCaptured?: boolean;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
        id: '0', 
        role: 'model', 
        text: "Welcome to SAVIMAN. I'm the AI Sales Engineer.\n\nI can provide quotes and technical drawings.\nTo start, what is your Name and Company?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Pass only role and text to Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
        const responseText = await chatWithSalesAI(history);
        
        // --- LEAD DATA EXTRACTION ---
        // Regex looks for ||LEAD_DATA:{...}||
        const leadRegex = /\|\|\s*LEAD_DATA\s*:\s*(\{.*?\})\s*\|\|/s;
        const match = responseText.match(leadRegex);
        
        let cleanText = responseText;
        let leadCaptured = false;

        if (match && match[1]) {
            // Remove the hidden tag from the message shown to user
            cleanText = responseText.replace(match[0], "").trim();
            
            try {
                const leadData = JSON.parse(match[1]);
                console.log("Saving Lead:", leadData);
                
                await InquiryService.create({
                    name: leadData.name || 'AI Chat Lead',
                    email: leadData.email || 'pending@saviman.com',
                    phone: leadData.phone || 'Not Provided',
                    company: leadData.company || 'Not Provided',
                    message: `[AI GENERATED LEAD]\nContext: ${input}\nDetails: ${leadData.details}`,
                });
                
                leadCaptured = true;
            } catch (e) {
                console.error("Lead Save Error:", e);
            }
        }

        const botMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: cleanText,
            isLeadCaptured: leadCaptured
        };
        
        setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error("Chat Error:", error);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Connection error. Please try again." }]);
    } finally {
        setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center"
          title="Open AI Sales Chat"
        >
          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white transition-transform transform group-hover:scale-110">
             <Bot size={32} />
             <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="absolute right-20 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 font-bold text-gray-800 text-sm whitespace-nowrap hidden md:block transition-all transform group-hover:-translate-x-2">
             Chat with Sales AI
          </div>
        </button>
      );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] md:w-[400px] bg-white rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden border border-gray-200 font-sans animate-fade-in-up h-[550px] md:h-[600px] max-h-[85vh]">
      
      <div className="bg-saviman-900 p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                 <Bot size={24} className="text-yellow-400"/>
             </div>
             <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-saviman-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-base">Saviman Sales AI</h3>
            <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-xs text-saviman-200">Online | Lead Capture Active</p>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2">
            <X size={16} /> CLOSE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-saviman-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'}`}>
              {msg.text}
            </div>
            
            {msg.isLeadCaptured && (
                <div className="mt-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200 flex items-center gap-2 animate-fade-in shadow-sm w-full">
                    <CheckCircle size={16} className="text-green-600"/>
                    <div>
                        <span className="font-bold block">Information Saved!</span>
                        <span className="text-[10px] opacity-80">Our team will call you shortly.</span>
                    </div>
                </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-saviman-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-saviman-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-saviman-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-saviman-500 focus-within:ring-2 focus-within:ring-saviman-100 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your answer..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-gray-700 placeholder-gray-400 outline-none"
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-saviman-600 text-white p-2.5 rounded-full hover:bg-saviman-700 disabled:opacity-50 transition shadow-md">
            {loading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
