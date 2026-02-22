import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const phoneNumber = "919506943134"; // SAVIMAN's number
  const defaultMessage = "Hi, I'm interested in getting a quote for brass components.";

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 flex items-center gap-2"
      >
        <MessageCircle size={24} />
      </a>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
      <div className="bg-green-500 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <MessageCircle size={20} />
          <span className="font-bold">WhatsApp</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Chat with our sales team directly. We typically reply within minutes.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={defaultMessage}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm mb-3 h-24 resize-none"
        />
        <button 
          onClick={handleSend}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Send size={16} /> Start Chat
        </button>
      </div>
    </div>
  );
};
