'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Send, Loader, MessageCircle, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const { messages, loading, error, sendMessage, clearChat, articleContext, initWithArticleContext } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-explain the article as soon as context is available
  useEffect(() => {
    if (articleContext && !loading) {
      initWithArticleContext();
    }
  }, [articleContext, loading, initWithArticleContext]);

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

  const suggestedQuestions = articleContext ? [
    'What does this mean in simple terms?',
    'How does this affect me?',
    'What should I do next?',
    'Summarize the key points',
  ] : [
    'What are today\'s top market trends?',
    'Explain inflation for a beginner',
    'What\'s happening with tech stocks?',
    'How should I invest for short-term gains?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">News Assistant</h1>
              <p className="text-sm text-gray-600">
                {articleContext ? 'Explaining this article' : 'Ask me about news'}
              </p>
            </div>
          </div>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
            Back
          </Link>
        </div>
      </div>

      {articleContext && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Explaining Article</p>
                <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-2">{articleContext.title}</h3>
                {articleContext.category && (
                  <span className="inline-block mt-2 text-xs bg-white px-2 py-1 rounded-full text-blue-700 font-medium">
                    {articleContext.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto">
        {messages.length === 0 && !articleContext ? (
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

              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-600">Suggested questions:</p>
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
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
                  className={`max-w-[85%] px-5 py-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded">
                        <MessageCircle size={14} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex items-center gap-3">
                    <Loader size={18} className="animate-spin text-blue-600" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-10 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={articleContext ? "Ask about this article..." : "Ask a question..."}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 transition shadow-md flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
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
