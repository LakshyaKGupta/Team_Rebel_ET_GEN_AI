'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, Send, X, Loader } from 'lucide-react';

export function ChatBotWidget() {
  const { messages, loading, error, sendMessage, clearChat } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasUserProfile, setHasUserProfile] = useState(false);

  useEffect(() => {
    // Check if user profile exists
    const profile = localStorage.getItem('userProfile');
    setHasUserProfile(!!profile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setInput('');
    await sendMessage(userInput);
  };

  const handleClear = () => {
    clearChat();
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-40 hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col z-50 h-96 md:h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">News Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-lg transition"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-2">Ask me about news, markets, or investments</p>
                  <p className="text-sm text-gray-500">Personalized for your profile</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <Loader size={16} className="animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                Error: {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4 rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </form>

            {/* Clear/Reset Button */}
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="w-full mt-2 text-xs text-gray-600 hover:text-gray-900 transition"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
