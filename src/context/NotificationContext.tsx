"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "./UserContext";

export interface Notification {
  id: string;
  type: "breaking" | "portfolio" | "topic" | "system" | "news";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  articleId?: string;
  link?: string;
  image?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  addNewsNotification: (article: { title: string; source?: string; url?: string; image?: string }) => void;
  checkNewsForInterests: (articles: Array<{ title: string; summary?: string; source?: string; url?: string; image?: string; category?: string }>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  markets: ["stock", "market", "sensex", "nifty", "bse", "nse", "trading", "shares", "equity", "fii", "dii"],
  economy: ["gdp", "inflation", "rbi", "interest", "budget", "fiscal", "economy", "tax", "rupee"],
  tech: ["tech", "ai", "startup", "software", "digital", "google", "microsoft", "meta", "apple", "amazon"],
  startups: ["startup", "funding", "unicorn", "venture", "investment", "ipo", "fundraise"],
  banking: ["bank", "loan", "credit", "nbfc", "finance", "hdfc", "sbi", "icici"],
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { preferences } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [seenArticleIds, setSeenArticleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("et_notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setNotifications(parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })));
        } else {
          setNotifications(getDefaultNotifications());
        }
      } catch (e) {
        console.error("Failed to parse notifications", e);
        setNotifications(getDefaultNotifications());
      }
    } else {
      setNotifications(getDefaultNotifications());
    }

    const savedSeen = localStorage.getItem("et_seen_articles");
    if (savedSeen) {
      try {
        setSeenArticleIds(new Set(JSON.parse(savedSeen)));
      } catch (e) {
        console.error("Failed to parse seen articles", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("et_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("et_seen_articles", JSON.stringify(Array.from(seenArticleIds)));
  }, [seenArticleIds]);

  const getUserInterestCategories = useCallback((): string[] => {
    const selectedInterests = preferences.selectedInterests || [];
    const categories: string[] = [];

    selectedInterests.forEach(interest => {
      const interestLower = interest.toLowerCase();
      Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
        if (keywords.some(keyword => interestLower.includes(keyword)) || category.includes(interestLower)) {
          if (!categories.includes(category)) {
            categories.push(category);
          }
        }
      });
    });

    if (categories.length === 0) {
      categories.push("general");
    }

    return categories;
  }, [preferences.selectedInterests]);

  const isArticleRelevant = useCallback((article: { title: string; summary?: string; category?: string }): boolean => {
    const userCategories = getUserInterestCategories();
    const articleText = `${article.title} ${article.summary || ''} ${article.category || ''}`.toLowerCase();

    for (const category of userCategories) {
      const keywords = CATEGORY_KEYWORDS[category] || [];
      if (keywords.some(keyword => articleText.includes(keyword))) {
        return true;
      }
      if (category.includes(articleText) || articleText.includes(category)) {
        return true;
      }
    }

    return userCategories.includes("general");
  }, [getUserInterestCategories]);

  const checkNewsForInterests = useCallback((articles: Array<{ title: string; summary?: string; source?: string; url?: string; image?: string; category?: string }>) => {
    if (preferences.notificationPref === "none") return;

    articles.forEach(article => {
      // Use the raw title as the unique identifier so it persists correctly across fetches
      const articleId = `news-${btoa(encodeURIComponent(article.title)).substring(0, 50)}`;
      
      if (seenArticleIds.has(articleId)) return;
      if (!isArticleRelevant(article)) return;

      setSeenArticleIds(prev => new Set([...Array.from(prev), articleId]));

      const newNotification: Notification = {
        id: `notif-news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "news",
        title: article.source || "News Update",
        message: article.title,
        timestamp: new Date(),
        read: false,
        articleId: articleId,
        link: article.url,
        image: article.image,
      };

      setNotifications(prev => {
        const exists = prev.find(n => n.message === article.title);
        if (exists) return prev;
        return [newNotification, ...prev].slice(0, 50);
      });
    });
  }, [preferences, seenArticleIds, isArticleRelevant]);

  const addNewsNotification = useCallback((article: { title: string; source?: string; url?: string; image?: string }) => {
    const articleId = `news-${Date.now()}`;
    
    if (seenArticleIds.has(articleId)) return;

    setSeenArticleIds(prev => new Set([...Array.from(prev), articleId]));

    const newNotification: Notification = {
      id: articleId,
      type: "news",
      title: article.source || "News Update",
      message: article.title,
      timestamp: new Date(),
      read: false,
      link: article.url,
      image: article.image,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, [seenArticleIds]);

  const getDefaultNotifications = (): Notification[] => {
    const defaults: Notification[] = [
      {
        id: "welcome",
        type: "system",
        title: "Welcome to ET News!",
        message: "Your personalized news briefing is ready. Start exploring to get AI-powered insights.",
        timestamp: new Date(),
        read: false,
      },
    ];

    const userCategories = getUserInterestCategories();
    if (userCategories.length > 0 && !userCategories.includes("general")) {
      defaults.push({
        id: "preferences-set",
        type: "system",
        title: "Notifications Set Up",
        message: `You'll receive updates on ${userCategories.join(", ")} news based on your interests.`,
        timestamp: new Date(Date.now() + 1000), // Slightly offset so it's most recent
        read: false,
      });
    }

    return defaults;
  };

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAll,
      addNewsNotification,
      checkNewsForInterests,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
