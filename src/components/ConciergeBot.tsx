import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Compass, Sparkles, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface ConciergeBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_STARTS = [
  "Why is Moraine Lake road closed to personal cars?",
  "What hikes do you recommend at Lake Louise?",
  "Tell me about the Valley of the Ten Peaks.",
  "Do I need a Parks Canada Pass to visit?"
];

export default function ConciergeBot({ isOpen, onClose }: ConciergeBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Welcome message
    return [{
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your **Moraine Go Rockies AI Concierge**. 🏔️\n\nI can help you plan your hiking trails, select photogenic lookouts around the Ten Peaks, understand mountain weather layers, and clarify park regulations regarding shuttles and parking closures.\n\n*How can I help you explore the wilderness today?*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Connection failed');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.output || "I couldn't generate a guide recommendation right now. Please test again or secure standard shuttle tickets using the reservation widget!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: "🌲 **Network Alert**: The Rockies AI Concierge is momentarily experiencing high cellular load. Rest assured, you can view all route details or call our reservation desk directly at **437-868-2108** for quick support!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 w-[90vw] md:w-[380px] h-[75vh] md:h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50 animate-fade-in"
      style={{ boxShadow: '0 12px 40px -10px rgba(13, 27, 42, 0.25)' }}
    >
      {/* Bot Header */}
      <div className="bg-[#0D1B2A] text-white p-4 flex justify-between items-center border-b border-brand-gold/20 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-brand-cyan to-teal-500 p-1.5 rounded-full relative">
            <Compass className="w-4 h-4 text-white animate-spin-slow" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#0D1B2A]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs tracking-wider flex items-center gap-1.5 text-brand-gold">
              ROCKIES AI CONCIERGE
            </h4>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block -mt-0.5">ONLINE ADVISOR</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Close assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message body */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-55 flex flex-col gap-4 text-xs">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end bg-brand-cyan text-white rounded-l-2xl rounded-tr-2xl p-3' : 'bg-slate-100 text-gray-800 rounded-r-2xl rounded-tl-2xl p-3 border border-gray-150'}`}
          >
            {/* Display Rich markdown rendering nicely simulated or handled */}
            <div className="markdown-body leading-relaxed font-sans">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            <span className={`text-[8px] mt-1.5 self-end ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="bg-slate-100 text-gray-700 rounded-r-2xl rounded-tl-2xl p-3 border border-gray-150 self-start max-w-[80%] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-[10px] text-gray-400 font-semibold ml-1">AI Concierge is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Pre-defined Suggestions Area */}
      {messages.length === 1 && !isLoading && (
        <div className="p-3 bg-slate-50 border-t border-gray-100 flex flex-col gap-1.5 flex-shrink-0">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-gold" /> Suggested Questions
          </p>
          <div className="flex flex-col gap-1">
            {QUICK_STARTS.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="text-left text-[11px] text-[#0A3254] font-medium bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-brand-cyan hover:bg-cyan-50/50 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-gray-150 flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Ask a question about Banff, Lake Louise or trails..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-50 text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline focus:outline-brand-cyan"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-brand-cyan hover:bg-[#066572] disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl transition cursor-pointer flex items-center justify-center"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
