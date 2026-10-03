'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Send, ShieldCheck, Calendar, MessageSquare, CheckCheck } from 'lucide-react';

function ChatContent() {
  const searchParams = useSearchParams();
  const queryWorkerId = searchParams.get('workerId');

  const { workers, messages, activeChatWorkerId, setActiveChatWorkerId, isTypingWorkerId, sendMessage } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set active worker if query param is passed
  useEffect(() => {
    if (queryWorkerId) {
      setActiveChatWorkerId(queryWorkerId);
    } else if (!activeChatWorkerId && workers.length > 0) {
      setActiveChatWorkerId(workers[0].id);
    }
  }, [queryWorkerId, activeChatWorkerId, workers, setActiveChatWorkerId]);

  const currentWorker = workers.find(w => w.id === activeChatWorkerId) || workers[0];
  const conversationMessages = messages.filter(m => m.workerId === currentWorker?.id);

  // Auto-scroll to bottom of chat canvas on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, isTypingWorkerId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentWorker) return;
    sendMessage(currentWorker.id, inputMessage.trim());
    setInputMessage('');
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-3 h-[780px]">
      
      {/* LEFT SIDEBAR: ACTIVE THREADS LIST */}
      <div className="border-r border-gray-100 flex flex-col bg-[#F7F7F5] h-full">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-extrabold text-[#2A2A2A] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#1F4E45]" /> Worker Conversations
          </h2>
          <p className="text-xs text-[#8A8F8C] mt-0.5">Discuss job details before booking</p>
        </div>

        {/* Conversations Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {workers.map((w) => {
            const lastMsg = messages.filter(m => m.workerId === w.id).slice(-1)[0];
            const isSelected = w.id === currentWorker?.id;

            return (
              <button
                key={w.id}
                onClick={() => setActiveChatWorkerId(w.id)}
                className={`w-full text-left p-4 flex items-center gap-3.5 transition-colors ${
                  isSelected ? 'bg-white border-l-4 border-[#1F4E45] shadow-xs' : 'hover:bg-white/60'
                }`}
              >
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-gray-200">
                  <img src={w.photoUrl} alt={w.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#2A2A2A] truncate">{w.name}</h4>
                    <span className="text-[10px] text-[#8A8F8C]">{lastMsg?.timestamp || '10:00 AM'}</span>
                  </div>

                  <p className="text-xs font-semibold text-[#1F4E45]">{w.category}</p>

                  <p className="text-xs text-[#8A8F8C] truncate mt-0.5">
                    {lastMsg ? lastMsg.text : `Chat with ${w.name}...`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN CHAT CANVAS */}
      <div className="lg:col-span-2 flex flex-col h-full bg-white">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-gray-100">
              <img src={currentWorker.photoUrl} alt={currentWorker.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#2A2A2A] flex items-center gap-2">
                {currentWorker.name}
                <ShieldCheck className="w-4 h-4 text-[#E8A33D]" />
              </h3>
              <p className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Online • {currentWorker.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/book/${currentWorker.id}`}
              className="px-4 py-2 rounded-xl bg-[#E8A33D] hover:bg-[#D6922C] text-[#2A2A2A] font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Now
            </Link>
          </div>
        </div>

        {/* Messages Stream Canvas */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F7F7F5]/50">
          
          <div className="bg-[#EAF3F0] p-3 rounded-2xl border border-[#2B6B5E]/20 text-center max-w-md mx-auto space-y-1">
            <p className="text-xs font-bold text-[#1F4E45] flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Daily Connect Direct Chat
            </p>
            <p className="text-[11px] text-[#8A8F8C]">
              Discuss job requirements, send pictures of damaged pipes/wires, and get estimates safely.
            </p>
          </div>

          {conversationMessages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md rounded-2xl p-4 space-y-1 shadow-xs text-xs sm:text-sm leading-relaxed ${
                    isCustomer
                      ? 'bg-[#1F4E45] text-white rounded-br-none'
                      : 'bg-white text-[#2A2A2A] border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      isCustomer ? 'text-emerald-100/70' : 'text-[#8A8F8C]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isCustomer && <CheckCheck className="w-3 h-3 text-[#E8A33D]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Simulated Typing Indicator */}
          {isTypingWorkerId === currentWorker.id && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 text-xs text-[#8A8F8C]">
                <span className="font-semibold text-[#1F4E45]">{currentWorker.name}</span> is typing
                <span className="inline-flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-[#1F4E45] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#1F4E45] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#1F4E45] rounded-full animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Type message to ${currentWorker.name}...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#F7F7F5] border border-gray-200 text-xs sm:text-sm text-[#2A2A2A] placeholder-[#8A8F8C] focus:outline-none focus:border-[#1F4E45]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-12 h-12 rounded-2xl bg-[#E8A33D] hover:bg-[#D6922C] disabled:opacity-50 text-[#2A2A2A] flex items-center justify-center font-bold shadow-md transition-all shrink-0"
          >
            <Send className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Suspense fallback={<div className="p-12 text-center text-xs text-[#8A8F8C]">Loading chat...</div>}>
        <ChatContent />
      </Suspense>
    </div>
  );
}
