
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { ChatMessage, ClothingItem } from '../types';
import { getChatResponse } from '../services/geminiService';
import { CLOTHING_ITEMS } from '../constants';

interface Props {
  initialMessages?: ChatMessage[];
  onSelectClothing: (item: ClothingItem) => void;
}

export const ChatAdvisor: React.FC<Props> = ({ initialMessages = [], onSelectClothing }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages.length > 0) {
        setMessages(prev => {
           if (prev.length === 0) return initialMessages;
           // Append new system messages if needed, or replace. Here we just set logic.
           return prev;
        });
    }
  }, [initialMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const responseText = await getChatResponse(history, input);

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "抱歉，我现在无法连接到时尚网络。" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    // Regex to find [[ID]] patterns
    const parts = text.split(/(\[\[.*?\]\])/g);

    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          const match = part.match(/^\[\[(.*?)\]\]$/);
          if (match) {
            const itemId = match[1];
            const item = CLOTHING_ITEMS.find(c => c.id === itemId);
            
            if (item) {
              return (
                <div key={index} className="bg-neutral-800 rounded-lg p-2 border border-white/10 mt-2 mb-2 w-full max-w-xs mx-auto shadow-sm">
                   <div className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover flex-shrink-0 bg-neutral-700" />
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                         <div className="text-xs font-bold truncate text-white">{item.name}</div>
                         <div className="text-[10px] text-gray-400 line-clamp-2">{item.description}</div>
                         <button 
                           onClick={() => onSelectClothing(item)}
                           className="mt-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] py-1.5 px-3 rounded-full flex items-center justify-center gap-1 transition-colors w-fit font-medium"
                         >
                            <Sparkles className="w-3 h-3" /> 一键试穿
                         </button>
                      </div>
                   </div>
                </div>
              );
            }
            return null; // ID not found in inventory
          }
          // Regular text
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 pb-20 md:pb-0">
      <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-neutral-900/50 backdrop-blur shrink-0">
        <Bot className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Lumina 造型顾问</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-500/50" />
             </div>
             <p className="text-sm px-8">问我任何关于时尚、配色或配饰的问题！我会帮你挑选最适合你的穿搭。</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-[#2a2a2a] text-gray-200 rounded-bl-none border border-white/5'
              }`}
            >
              {renderMessageContent(msg.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2 shrink-0 self-end mb-1 opacity-50">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 rounded-2xl p-4 rounded-bl-none flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 bg-neutral-900 shrink-0">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 bg-neutral-800 text-white rounded-full pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/5"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:opacity-50 disabled:bg-gray-700 transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
