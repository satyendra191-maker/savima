import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles, Phone, Mail, Building2, Globe } from 'lucide-react';
import { AIGeneratedLeadsService, LeadsService } from '../services/leads';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LeadData {
  person_name?: string;
  company_name?: string;
  country_code?: string;
  contact_number?: string;
  email?: string;
  requirement_description?: string;
}

interface AIChatWidgetProps {
  onClose?: () => void;
}

const INITIAL_QUESTIONS = [
  "Hi! I'm Saviman AI. How can I help you today?",
  "I can help you find products, get shipping quotes, or answer questions about our manufacturing capabilities.",
  "What would you like to know?"
];

const BUYING_INTENT_KEYWORDS = [
  'buy', 'purchase', 'order', 'quote', 'price', 'cost', 'sample', 'delivery',
  'shipping', 'interested', 'need', 'requirement', 'volume', 'bulk', 'custom'
];

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [step, setStep] = useState<'greeting' | 'collecting' | 'done'>('greeting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show initial greeting
    setTimeout(() => {
      INITIAL_QUESTIONS.forEach((q, i) => {
        setTimeout(() => {
          addMessage('assistant', q);
        }, i * 1000);
      });
    }, 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date()
    }]);
  };

  const detectBuyingIntent = (text: string): number => {
    const lowerText = text.toLowerCase();
    let score = 0;
    BUYING_INTENT_KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) score += 1;
    });
    return Math.min(score * 20, 100); // Max 100
  };

  const analyzeAndCollectLead = (text: string) => {
    const intentScore = detectBuyingIntent(text);
    
    // Check for contact info patterns
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/);
    
    const newLeadData = { ...leadData };
    let hasNewData = false;
    
    if (emailMatch && !newLeadData.email) {
      newLeadData.email = emailMatch[0];
      hasNewData = true;
    }
    
    if (phoneMatch && !newLeadData.contact_number) {
      newLeadData.contact_number = phoneMatch[0];
      hasNewData = true;
    }
    
    if (intentScore >= 40 && !showLeadForm) {
      setShowLeadForm(true);
      setStep('collecting');
    }
    
    setLeadData(newLeadData);
    return { intentScore, hasNewData };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setLoading(true);

    // Analyze for buying intent and collect lead data
    const { intentScore } = analyzeAndCollectLead(userMessage);

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (intentScore >= 60) {
        response = "That sounds like you're interested in our products! I'd love to help you further. Could you share your contact details so our team can assist you better?";
        if (!showLeadForm) setShowLeadForm(true);
      } else if (intentScore >= 30) {
        response = "I understand you're looking for more information. To provide you with accurate details, could you tell me more about your requirements?";
      } else {
        const responses = [
          "Thank you for your message! Could you tell me more about what you're looking for?",
          "I'd be happy to help! What specific products or information are you interested in?",
          "Great question! Let me help you find the right solution. What are your requirements?"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      addMessage('assistant', response);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const saveLead = async () => {
    if (!leadData.person_name && !leadData.email && !leadData.contact_number) {
      addMessage('assistant', 'Please provide at least your name, email, or phone number so we can contact you.');
      return;
    }

    try {
      // Save as AI generated lead
      await AIGeneratedLeadsService.create({
        session_id: sessionId,
        person_name: leadData.person_name,
        company_name: leadData.company_name,
        country_code: leadData.country_code,
        contact_number: leadData.contact_number,
        email: leadData.email,
        requirement_description: leadData.requirement_description,
        conversation_summary: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        buying_intent_score: detectBuyingIntent(leadData.requirement_description || ''),
        status: 'pending',
        is_partial: false
      });

      // Also save as regular lead
      await LeadsService.create({
        person_name: leadData.person_name || 'Unknown',
        company_name: leadData.company_name,
        country_code: leadData.country_code,
        contact_number: leadData.contact_number,
        email: leadData.email,
        requirement_description: leadData.requirement_description,
        source: 'ai_chatbot',
        status: 'new'
      });

      addMessage('assistant', "Thank you! We've received your information. Our team will contact you within 24 hours. Is there anything else I can help you with?");
      setStep('done');
      setShowLeadForm(false);
    } catch (error) {
      addMessage('assistant', 'There was an error saving your information. Please try again or contact us directly.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-brass-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.role === 'assistant' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-brass-500" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Lead Form */}
      {showLeadForm && step === 'collecting' && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-brass-50 dark:bg-brass-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-brass-500" size={16} />
            <span className="text-sm font-medium text-brass-600 dark:text-brass-400">
              Please share your contact details
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Your Name *"
              value={leadData.person_name || ''}
              onChange={(e) => setLeadData({ ...leadData, person_name: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
            <input
              type="text"
              placeholder="Company"
              value={leadData.company_name || ''}
              onChange={(e) => setLeadData({ ...leadData, company_name: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
            <input
              type="email"
              placeholder="Email *"
              value={leadData.email || ''}
              onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={leadData.contact_number || ''}
              onChange={(e) => setLeadData({ ...leadData, contact_number: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
            <input
              type="text"
              placeholder="Country (e.g., US, UK)"
              value={leadData.country_code || ''}
              onChange={(e) => setLeadData({ ...leadData, country_code: e.target.value })}
              className="col-span-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
            <textarea
              placeholder="Tell us about your requirements..."
              value={leadData.requirement_description || ''}
              onChange={(e) => setLeadData({ ...leadData, requirement_description: e.target.value })}
              className="col-span-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              rows={2}
            />
            <button
              onClick={saveLead}
              className="col-span-2 px-4 py-2 bg-brass-500 text-white rounded-lg text-sm font-medium hover:bg-brass-600"
            >
              Submit Details
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      {step !== 'done' && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brass-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-2 bg-brass-500 text-white rounded-full hover:bg-brass-600 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
