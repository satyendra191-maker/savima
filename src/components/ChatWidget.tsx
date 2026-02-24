'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Minus, Maximize2 } from 'lucide-react';
import { AIGeneratedLeadsService } from '../services/leads';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
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

const STORAGE_KEY = 'saviman-chat-position-v4';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'model', text: "Hello! 👋 I'm Saviman AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadStep, setLeadStep] = useState<'name' | 'company' | 'email' | 'phone' | 'requirements' | 'complete'>('name');
  const [leadData, setLeadData] = useState<LeadData>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPosition(parsed);
          return;
        }
      } catch (e) { }
    }
    setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) setHasMoved(true);
      const boundedX = Math.max(10, Math.min(newX, window.innerWidth - (isOpen ? 410 : 70)));
      const boundedY = Math.max(10, Math.min(newY, window.innerHeight - (isOpen ? 590 : 70)));
      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Lead Capture Flow
    if (leadStep !== 'complete') {
      const updated = { ...leadData };
      let nextStep: typeof leadStep = leadStep;
      let responseText = '';

      if (leadStep === 'name') {
        updated.name = input;
        nextStep = 'company';
        responseText = "Nice to meet you! What is your company name?";
      } else if (leadStep === 'company') {
        updated.company = input;
        nextStep = 'email';
        responseText = "Got it. And your professional email address?";
      } else if (leadStep === 'email') {
        updated.email = input;
        nextStep = 'phone';
        responseText = "Almost there. What is your contact number?";
      } else if (leadStep === 'phone') {
        updated.phone = input;
        nextStep = 'requirements';
        responseText = "Great. Finally, please tell me about your manufacturing requirements.";
      } else if (leadStep === 'requirements') {
        updated.requirements = input;
        nextStep = 'complete';
        responseText = "Thank you! I've captured your inquiry. Our engineering team will contact you shortly.";

        // SAVE TO SUPABASE
        try {
          await AIGeneratedLeadsService.create({
            person_name: updated.name,
            company_name: updated.company,
            email: updated.email,
            contact_number: updated.phone,
            requirement_description: updated.requirements,
            buying_intent_score: 80,
            status: 'pending'
          });
        } catch (e) {
          console.error("Failed to save lead:", e);
        }
      }

      setLeadData(updated);
      setLeadStep(nextStep);

      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: responseText }]);
        setLoading(false);
      }, 800);
      return;
    }

    // Standard AI Response after lead capture
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I've passed your requirements to our sales engineers. You can also explore our catalogs or track an existing order above." }]);
      setLoading(false);
    }, 1000);
  };

  if (position.x === -1) return null;

  return (
    <div className="fixed z-[9999] select-none" style={{ left: position.x, top: position.y }}>
      {!isOpen ? (
        <button
          onMouseDown={handleMouseDown}
          onClick={(e) => { e.stopPropagation(); if (!hasMoved) setIsOpen(true); }}
          className={`w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-2xl flex items-center justify-center text-white border-2 border-white/50 transition-transform active:scale-95 ${isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-110'}`}
        >
          <Sparkles size={24} className={isDragging ? '' : 'animate-pulse'} />
        </button>
      ) : (
        <div className="flex flex-col bg-white dark:bg-gray-950 rounded-2xl shadow-3xl border border-amber-500/30 overflow-hidden" style={{ width: 'min(380px, 90vw)', height: isMinimized ? 'auto' : '550px' }}>
          <div onMouseDown={handleMouseDown} className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex justify-between items-center text-white cursor-grab">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-bold text-sm">Saviman AI</span>
            </div>
            <div className="flex gap-1">
              <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded"><Minus size={14} /></button>
              <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsOpen(false)} className="p-1 bg-red-500 hover:bg-red-600 rounded"><X size={14} /></button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && <div className="flex justify-start"><div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex gap-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div></div></div>}
              </div>
              <div className="p-3 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-2 bg-gray-50 dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-900 dark:text-white outline-none" />
                  <button onClick={handleSend} disabled={loading || !input.trim()} className="w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center disabled:opacity-50"><Send size={16} /></button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
