"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  time: string;
  hasBriefing: boolean;
  readTime: string;
  icon: React.ElementType;
}

interface AIResponse {
  mode: string;
  content: string;
  timestamp: number;
  error?: string;
}

interface BriefingState {
  selectedTopic: Topic | null;
  isLoading: boolean;
  interactionMode: string | null;
  aiResponses: AIResponse[];
  lastUpdated: number | null;
  error: string | null;
}

interface BriefingContextType {
  state: BriefingState;
  selectTopic: (topic: Topic | null) => void;
  setLoading: (loading: boolean) => void;
  setInteractionMode: (mode: string | null) => void;
  addAIResponse: (response: AIResponse) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearResponses: () => void;
  reset: () => void;
}

const initialState: BriefingState = {
  selectedTopic: null,
  isLoading: false,
  interactionMode: null,
  aiResponses: [],
  lastUpdated: null,
  error: null,
};

const BriefingContext = createContext<BriefingContextType | undefined>(undefined);

export function BriefingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BriefingState>(initialState);

  const selectTopic = (topic: Topic | null) => {
    setState((prev) => ({
      ...prev,
      selectedTopic: topic,
      interactionMode: null,
      lastUpdated: topic ? Date.now() : prev.lastUpdated,
      error: null,
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading, error: null }));
  };

  const setInteractionMode = (interactionMode: string | null) => {
    setState((prev) => ({ ...prev, interactionMode }));
  };

  const addAIResponse = (response: AIResponse) => {
    setState((prev) => ({
      ...prev,
      aiResponses: [...prev.aiResponses.filter((r) => r.mode !== response.mode), response],
      lastUpdated: Date.now(),
    }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const clearResponses = () => {
    setState((prev) => ({ ...prev, aiResponses: [], interactionMode: null, error: null }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <BriefingContext.Provider
      value={{
        state,
        selectTopic,
        setLoading,
        setInteractionMode,
        addAIResponse,
        setError,
        clearError,
        clearResponses,
        reset,
      }}
    >
      {children}
    </BriefingContext.Provider>
  );
}

export function useBriefing() {
  const context = useContext(BriefingContext);
  if (context === undefined) {
    throw new Error("useBriefing must be used within a BriefingProvider");
  }
  return context;
}
