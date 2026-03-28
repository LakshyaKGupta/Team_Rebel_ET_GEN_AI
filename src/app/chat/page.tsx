'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Send, Loader, MessageCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const { messages, loading, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (window.confirm('Clear all messages?')) {
      clearChat();
      setInput('');
    }
  };

  const suggestedQuestions = [
    'What are today\'s top market trends?',
    'Explain inflation for a beginner',
    'How should I invest for short-term gains?',
    'What\'s happening with tech stocks?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">News Assistant</h1>
              <p className="text-sm text-gray-600">Ask me about markets, news, and investments</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
            Back
          </Link>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-full">
                  <MessageCircle size={64} className="text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start a Conversation</h2>
                <p className="text-gray-600 mb-6">Ask me anything about news, markets, or investments</p>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-600">Suggested questions:</p>
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(question);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition text-sm text-gray-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-5 py-3 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-base leading-relaxed">{msg.content}</p>
                  <p className="text-xs mt-2 opacity-70">
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
                <div className="bg-gray-200 text-gray-900 px-5 py-3 rounded-xl rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <Loader size={18} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition"
                title="Clear conversation"
              >
                <Trash2 size={18} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
