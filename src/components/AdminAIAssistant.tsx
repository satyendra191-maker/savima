import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bot, X, Minus, Send, Loader2, Sparkles, Wand2, FileText, 
  Image, MessageSquare, Search, Package, Settings, RefreshCw, Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface AdminMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = 'saviman-admin-ai-position';
const CHAT_HISTORY_KEY = 'saviman-admin-ai-history';

interface AdminAIAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminAIAssistant: React.FC<AdminAIAssistantProps> = ({ isOpen: propIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propIsOpen !== undefined ? () => {} : setInternalIsOpen;
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { x: 24, y: 100 };
      }
    }
    return { x: 24, y: 100 };
  });

  const [messages, setMessages] = useState<AdminMessage[]>(() => {
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
  const [mode, setMode] = useState<'chat' | 'generate' | 'image'>('chat');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 450));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 650));
      setPosition({ x: newX, y: newY });
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

  const handleSend = async () => {
    if (!input.trim() || loading || !isAdmin) return;

    const userMessage: AdminMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call the AI API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: {
            path: '/admin',
            isAdmin: true,
            history: messages.slice(-10).map(m => ({
              role: m.role,
              content: m.content
            }))
          }
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      const assistantMessage: AdminMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I could not process your request.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Log to admin_ai_logs
      try {
        await supabase
          .from('admin_ai_logs')
          .insert([{
            user_id: (await supabase.auth.getUser()).data.user?.id || 'unknown',
            command: input,
            response: assistantMessage.content,
            mode: mode
          }]);
      } catch (logError) {
        console.error('Failed to log AI interaction:', logError);
      }

    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: AdminMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
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

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const adminCommands = [
    { cmd: 'Create product', desc: 'Generate product content', icon: Package },
    { cmd: 'Write blog', desc: 'Create blog post', icon: FileText },
    { cmd: 'SEO content', desc: 'Generate SEO meta', icon: Search },
    { cmd: 'Reply inquiry', desc: 'Draft response', icon: MessageSquare },
    { cmd: 'Generate image', desc: 'Create banner idea', icon: Image },
  ];

  if (!isOpen) {
    return (
      <div
        className="fixed z-[9999] cursor-move"
        style={{ left: position.x, top: position.y, touchAction: 'none' }}
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-ping opacity-30"></div>
          <div 
            className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full shadow-2xl flex items-center justify-center text-white border-2 border-white/20"
            style={{ boxShadow: '0 4px 20px rgba(0, 123, 255, 0.4)' }}
          >
            <Wand2 size={24} />
          </div>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white dark:bg-surface-dark px-3 py-2 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-white">
              <Wand2 size={12} className="text-primary-500" />
              AI Assistant
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999] flex flex-col bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden transition-shadow duration-200 border border-neutral-200 dark:border-neutral-700"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? 'auto' : 'min(420px, calc(100vw - 60px))',
        height: isMinimized ? 'auto' : 'min(550px, calc(100vh - 120px))',
        boxShadow: isDragging 
          ? '0 8px 40px rgba(0, 0, 0, 0.3)' 
          : '0 4px 24px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-move no-drag select-none bg-gradient-to-r from-primary-500 to-secondary-500`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Wand2 size={20} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-accent-600 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Admin AI Assistant</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <p className="text-xs text-white/80">Ready</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 no-drag">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </button>
          <button
            onClick={() => { setIsOpen(false); onClose?.(); }}
            className="p-1.5 rounded-lg text-white/80 hover:bg-red-500/80 hover:text-white transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      {!isMinimized && (
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
          {[
            { id: 'chat', label: 'Chat', icon: Bot },
            { id: 'generate', label: 'Generate', icon: Wand2 },
            { id: 'image', label: 'Images', icon: Image },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                mode === tab.id
                  ? 'bg-white dark:bg-surface-dark text-accent-600 dark:text-accent-400 border-b-2 border-accent-500'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {!isMinimized && (
        <>
          {/* Quick Commands */}
          <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/30 border-b border-neutral-200 dark:border-neutral-700">
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Quick Commands</p>
            <div className="flex flex-wrap gap-1">
              {adminCommands.map((cmd) => (
                <button
                  key={cmd.cmd}
                  onClick={() => setInput(cmd.cmd.toLowerCase())}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-600 rounded-md text-neutral-600 dark:text-neutral-300 hover:border-accent-400 hover:text-accent-600 transition-colors"
                >
                  <cmd.icon size={10} />
                  {cmd.cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900/50 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-14 h-14 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
                  <Wand2 size={24} className="text-accent-600 dark:text-accent-400" />
                </div>
                <h4 className="font-semibold text-neutral-800 dark:text-white mb-1">Admin AI Helper</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Create content, generate replies, analyze data
                </p>
                {isAdmin && (
                  <p className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    ✓ Admin access enabled
                  </p>
                )}
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-surface-dark text-neutral-800 dark:text-neutral-100 rounded-bl-none border border-neutral-200 dark:border-neutral-600'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-600 rounded-2xl rounded-bl-none px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-surface-dark border-t border-neutral-200 dark:border-neutral-700">
            {!isAdmin ? (
              <div className="text-center py-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                Admin access required
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your command..."
                      className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-full text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="p-2 bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-full transition-colors"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                {messages.length > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <button onClick={clearChat} className="text-xs text-neutral-400 hover:text-red-500">
                      Clear chat
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAIAssistant;
