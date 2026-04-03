'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useUser } from './UserContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ArticleContext {
  title: string;
  summary: string;
  url: string;
  category?: string;
  generalView?: string;
  keyTakeaways?: string[];
  impact?: Record<string, string>;
  sources?: Array<{ name: string; url: string }>;
}

interface ChatContextType {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  articleContext: ArticleContext | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  initWithArticleContext: () => void;
  setArticleContext: (ctx: ArticleContext | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articleContext, setArticleContext] = useState<ArticleContext | null>(null);
  const { preferences } = useUser();
  // Track whether we've auto-sent the init message for a given article
  const autoSentFor = useRef<string | null>(null);

  // On mount: pick up any context stored by briefing page via localStorage (for "Ask AI" button navigation)
  useEffect(() => {
    const stored = localStorage.getItem('articleContext');
    if (stored) {
      try {
        const ctx = JSON.parse(stored);
        setArticleContext(ctx);
        localStorage.removeItem('articleContext');
      } catch (e) {
        console.error('Failed to parse article context:', e);
      }
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    setError(null);
    setLoading(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          userProfile: {
            userType: preferences.userType || 'exploring',
            experienceLevel: preferences.experienceLevel || 'beginner',
            riskAppetite: preferences.riskAppetite || 'moderate',
            timeHorizon: preferences.timeHorizon || 'medium',
            goal: preferences.goal || 'stay updated',
            selectedInterests: preferences.selectedInterests || [],
          },
          articleContext: articleContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? (err.message.includes('high demand') || err.message.includes('busy')
              ? 'AI is temporarily busy. Please try again.'
              : err.message)
          : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  }, [messages, preferences, articleContext]);

  const initWithArticleContext = useCallback(() => {
    if (!articleContext) return;
    // Prevent sending twice for the same article
    if (autoSentFor.current === articleContext.title) return;

    autoSentFor.current = articleContext.title;

    const introMessage = articleContext.generalView
      ? `Can you explain this article for me?\n\n"${articleContext.title}"\n\n${articleContext.generalView}`
      : articleContext.summary
        ? `Can you explain this article for me?\n\n"${articleContext.title}"\n\n${articleContext.summary}`
        : `Can you explain this article for me: "${articleContext.title}"`;

    sendMessage(introMessage);
  }, [articleContext, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setArticleContext(null);
    setError(null);
    autoSentFor.current = null;
  }, []);

  return (
    <ChatContext.Provider value={{ messages, loading, error, articleContext, sendMessage, clearChat, initWithArticleContext, setArticleContext }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
