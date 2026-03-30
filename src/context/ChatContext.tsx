'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserPreferences } from './UserContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string, userPreferences?: UserPreferences) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, userPreferences?: UserPreferences) => {
    setError(null);
    setLoading(true);

    // Add user message
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
          messages: messages
            .concat(userMessage)
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          userProfile: userPreferences || {},
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
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, loading, error, sendMessage, clearChat }}>
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
