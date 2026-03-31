"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, TrendingUp, Star, AlertCircle, ExternalLink, Newspaper } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";

export default function NotificationsPage() {
  const router = useRouter();
  const { preferences } = useUser();
  const { notifications, markAsRead, markAllAsRead, clearNotification, clearAll, unreadCount } = useNotifications();
  const [activeNav, setActiveNav] = useState<"home" | "topics">("home");
  const [filter, setFilter] = useState<"all" | "unread" | "news" | "breaking">("all");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "breaking") return n.type === "breaking";
    if (filter === "news") return n.type === "news";
    return true;
  });

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "breaking":
        return <AlertCircle size={18} className="text-red-500" />;
      case "portfolio":
        return <TrendingUp size={18} className="text-green-500" />;
      case "topic":
        return <Star size={18} className="text-yellow-500" />;
      case "news":
        return <Newspaper size={18} className="text-blue-500" />;
      default:
        return <Bell size={18} className="text-[#8B4513]" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      window.open(notification.link, "_blank");
    } else if (notification.articleId && notification.articleId.startsWith("live-")) {
      router.push(`/briefing/${notification.articleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE7] text-[#1A1A1A] lg:flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 pb-40 lg:pb-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 lg:px-6 lg:py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 hover:bg-[#F8F3EB] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Notifications</h1>
              <p className="text-sm text-[#5C5C5C]">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:bg-[#F8F3EB]"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "news", label: "News" },
              { id: "breaking", label: "Breaking" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === tab.id ? "bg-[#1A1A1A] text-white" : "border border-[#DDD4C4] bg-white text-[#5C5C5C]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="rounded-[24px] border border-[#DDD4C4] bg-white p-8 text-center">
              <Bell size={48} className="mx-auto mb-4 text-[#DDD4C4]" />
              <p className="text-lg font-semibold">No notifications</p>
              <p className="mt-2 text-sm text-[#5C5C5C]">
                {filter === "unread" ? "You're all caught up!" : filter === "news" ? "No news notifications yet. News matching your interests will appear here." : "We'll notify you about important updates."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-[20px] border p-4 transition-all ${
                    notification.read
                      ? "border-[#E8E1D3] bg-white"
                      : "border-[#8B4513] bg-[#FDF9F3] shadow-sm"
                  }`}
                >
                  <div className="flex gap-3">
                    {notification.image && (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img 
                          src={notification.image} 
                          alt="" 
                          className="h-full w-full object-cover"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.read ? "bg-[#F5F0E6]" : "bg-[#F8F3EB]"
                    }`} style={{ display: notification.image ? 'none' : 'flex' }}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              notification.type === 'news' ? 'bg-blue-100 text-blue-700' :
                              notification.type === 'breaking' ? 'bg-red-100 text-red-700' :
                              notification.type === 'portfolio' ? 'bg-green-100 text-green-700' :
                              'bg-[#F4EBDD] text-[#8B4513]'
                            }`}>
                              {notification.type === 'news' && <Newspaper size={10} />}
                              {notification.type === 'breaking' && <AlertCircle size={10} />}
                              {notification.type === 'portfolio' && <TrendingUp size={10} />}
                              {notification.type === 'system' && <Bell size={10} />}
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                          </div>
                          <h3 className={`mt-1 font-semibold ${notification.read ? "text-[#5C5C5C]" : "text-[#1A1A1A]"}`}>
                            {notification.title}
                          </h3>
                        </div>
                        <span className="text-xs whitespace-nowrap text-[#5C5C5C]">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${notification.read ? "text-[#999]" : "text-[#5C5C5C]"} line-clamp-2`}>
                        {notification.message}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="flex items-center gap-1 text-xs font-medium text-[#8B4513] hover:text-[#6B3510]"
                        >
                          {notification.link ? (
                            <>
                              Read full article <ExternalLink size={12} />
                            </>
                          ) : (
                            "View details"
                          )}
                        </button>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs font-medium text-[#5C5C5C] hover:text-[#8B4513]"
                          >
                            <Check size={12} />
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="ml-auto flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Clear all notifications
            </button>
          )}

          <div className="rounded-[20px] bg-[#F8F3EB] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">Notification Settings</p>
            <p className="mt-2 text-sm text-[#5C5C5C]">
              Your notification preference is set to: <span className="font-medium capitalize">{preferences.notificationPref || "Key updates"}</span>
            </p>
            <p className="mt-1 text-xs text-[#5C5C5C]">
              Based on your interests: <span className="font-medium">{(preferences.selectedInterests || []).join(", ") || "None selected"}</span>
            </p>
            <button
              onClick={() => router.push("/profile?tab=notifications")}
              className="mt-3 text-sm font-medium text-[#8B4513] hover:underline"
            >
              Change notification settings →
            </button>
          </div>
        </div>
      </main>

      <BottomNav activeNav={activeNav} onNavChange={setActiveNav} />
    </div>
  );
}
