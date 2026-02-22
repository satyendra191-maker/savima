import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bot, X, Minus, Send, Loader2, GripVertical, 
  Sparkles, ChevronDown, MessageSquare 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = 'saviman-ai-position';
const CHAT_HISTORY_KEY = 'saviman-ai-chat-history';

const pageContextSuggestions: Record<string, string[]> = {
  '/': [
    'What products do you manufacture?',
    'How can I request a quote?',
    'Tell me about your company'
  ],
  '/products': [
    'Show me brass components',
    'What SS products do you have?',
    'I need a custom part'
  ],
  '/contact': [
    'How can I reach you?',
    'Where are you located?',
    'What are your business hours?'
  ],
  '/admin': [
    'Help me create a new product',
    'Show recent inquiries',
    'Help me write CMS content'
  ],
  '/admin/products': [
    'Help me add a new product',
    'Show product analytics',
    'Edit existing product'
  ],
  '/admin/inquiries': [
    'Show pending inquiries',
    'Help manage leads',
    'Export inquiry data'
  ]
};

export const MovableAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const getInitialPosition = (): Position => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { x: window.innerWidth - 80, y: window.innerHeight - 80 };
      }
    }
    return { x: window.innerWidth - 80, y: window.innerHeight - 80 };
  };

  const [position, setPosition] = useState<Position>(() => getInitialPosition());
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { theme } = useTheme();
  const { isAdmin } = useAuth();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const getContextualSuggestions = useCallback(() => {
    const path = location.pathname;
    for (const [key, suggestions] of Object.entries(pageContextSuggestions)) {
      if (path.startsWith(key)) {
        return suggestions;
      }
    }
    if (isAdmin) {
      return pageContextSuggestions['/admin'];
    }
    return pageContextSuggestions['/'];
  }, [location.pathname, isAdmin]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 400));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 600));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(touch.clientX - dragStart.x, window.innerWidth - 400));
      const newY = Math.max(0, Math.min(touch.clientY - dragStart.y, window.innerHeight - 600));
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: {
            path: location.pathname,
            isAdmin,
            history: messages.slice(-10).map(m => ({
              role: m.role,
              content: m.content
            }))
          }
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I could not process your request.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const isDark = theme === 'dark';

  const handleMinimizeMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMinimizeTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  if (!isOpen) {
    return (
      <div
        className="fixed z-[9999] cursor-move select-none"
        style={{ left: position.x, top: position.y, touchAction: 'none' }}
        onMouseDown={handleMinimizeMouseDown}
        onTouchStart={handleMinimizeTouchStart}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
          className="group flex items-center justify-center"
          title="Open Saviman AI Assistant"
        >
          <div className="absolute inset-0 bg-primary-600 rounded-full animate-ping opacity-30"></div>
          <div 
            className="relative w-14 h-14 bg-gradient-to-br from-primary-700 to-primary-900 rounded-full shadow-2xl flex items-center justify-center text-white border-2 border-white/20 transition-transform transform group-hover:scale-110"
            style={{ boxShadow: '0 4px 20px rgba(11, 31, 59, 0.4)' }}
          >
            <Sparkles size={24} className="text-brass-400" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-shadow duration-200"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? 'auto' : 'min(380px, calc(100vw - 40px))',
        height: isMinimized ? 'auto' : 'min(550px, calc(100vh - 100px))',
        boxShadow: isDragging 
          ? '0 8px 40px rgba(11, 31, 59, 0.5)' 
          : '0 4px 24px rgba(11, 31, 59, 0.3)',
        touchAction: 'none'
      }}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-move no-drag select-none ${
          isDark ? 'bg-primary-800' : 'bg-gradient-to-r from-primary-700 to-primary-900'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={20} className="text-brass-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-primary-800 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Saviman AI</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <p className="text-xs text-primary-200">Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 no-drag">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-primary-200 hover:bg-white/10 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-primary-200 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800/50 space-y-3 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-4">
                  <Bot size={32} className="text-primary-600 dark:text-primary-300" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How can I help you today?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Ask me about products, get quotes, or help with your inquiry.
                </p>
                
                <div className="w-full">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1 mx-auto mb-3 hover:underline"
                  >
                    <Sparkles size={14} />
                    Suggestions
                    <ChevronDown size={14} className={`transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSuggestions && (
                    <div className="grid gap-2 animate-fade-in">
                      {getContextualSuggestions().map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-left px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-gray-700 dark:text-gray-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors shadow-md disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            
            {messages.length > 0 && (
              <div className="flex justify-between items-center mt-2 px-2">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear chat
                </button>
                <span className="text-[10px] text-gray-400">
                  Press Enter to send
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovableAIAssistant;
