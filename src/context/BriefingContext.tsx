"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AIResponse, BriefingMode, Topic } from "@/lib/types";

interface LiveArticle {
  id: string;
  title: string;
  summary: string;
  source?: string;
  url?: string;
  date?: string;
  image?: string;
  category?: string;
}

interface BriefingState {
  selectedTopic: Topic | null;
  isLoading: boolean;
  interactionMode: BriefingMode | null;
  aiResponses: AIResponse[];
  lastUpdated: number | null;
  error: string | null;
  currentArticle: LiveArticle | null;
}

interface BriefingContextType {
  state: BriefingState;
  selectTopic: (topic: Topic | null) => void;
  setLoading: (loading: boolean) => void;
  setInteractionMode: (mode: BriefingMode | null) => void;
  addAIResponse: (response: AIResponse) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearResponses: () => void;
  reset: () => void;
  setCurrentArticle: (article: LiveArticle | null) => void;
}

const initialState: BriefingState = {
  selectedTopic: null,
  isLoading: false,
  interactionMode: null,
  aiResponses: [],
  lastUpdated: null,
  error: null,
  currentArticle: null,
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

  const setInteractionMode = (interactionMode: BriefingMode | null) => {
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

  const setCurrentArticle = (article: LiveArticle | null) => {
    setState((prev) => ({ ...prev, currentArticle: article }));
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
        setCurrentArticle,
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
