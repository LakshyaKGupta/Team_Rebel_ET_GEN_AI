"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";

export interface Notification {
  id: string;
  type: "breaking" | "portfolio" | "topic" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  articleId?: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { preferences } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("et_notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })));
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    } else {
      setNotifications(getDefaultNotifications());
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("et_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    if (preferences.notificationPref === "none" || !preferences.notificationsEnabled) return;

    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [preferences]);

  const getDefaultNotifications = (): Notification[] => [
    {
      id: "welcome",
      type: "system",
      title: "Welcome to ET News!",
      message: "Your personalized news briefing is ready. Start exploring to get AI-powered insights.",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "portfolio-tip",
      type: "portfolio",
      title: "Portfolio alerts set up",
      message: "You'll receive notifications when news affects your portfolio holdings.",
      timestamp: new Date(Date.now() - 1800000),
      read: false,
    },
  ];

  const checkForNewNotifications = () => {
    const alerts = generateAlerts();
    alerts.forEach(alert => {
      const exists = notifications.find(n => n.id === alert.id);
      if (!exists) {
        setNotifications(prev => [alert, ...prev]);
      }
    });
  };

  const generateAlerts = (): Notification[] => {
    const alerts: Notification[] = [];
    const now = new Date();

    if (Math.random() > 0.7) {
      alerts.push({
        id: `alert-${now.getTime()}`,
        type: "breaking",
        title: "Breaking: Market Update",
        message: "Major market movement detected. Check your portfolio for updates.",
        timestamp: now,
        read: false,
      });
    }

    return alerts;
  };

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
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
