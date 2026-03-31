"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, TrendingUp, Star, AlertCircle } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/nav/BottomNav";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";

export default function NotificationsPage() {
  const router = useRouter();
  const { preferences } = useUser();
  const { notifications, markAsRead, markAllAsRead, clearNotification, clearAll, unreadCount } = useNotifications();
  const [activeNav, setActiveNav] = useState<"home" | "topics">("home");
  const [filter, setFilter] = useState<"all" | "unread" | "breaking">("all");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "breaking") return n.type === "breaking";
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
              { id: "breaking", label: "Breaking" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
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
                {filter === "unread" ? "You're all caught up!" : "We'll notify you about important updates."}
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
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.read ? "bg-[#F5F0E6]" : "bg-[#F8F3EB]"
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold ${notification.read ? "text-[#5C5C5C]" : "text-[#1A1A1A]"}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs whitespace-nowrap text-[#5C5C5C]">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${notification.read ? "text-[#999]" : "text-[#5C5C5C]"}`}>
                        {notification.message}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs font-medium text-[#8B4513] hover:text-[#6B3510]"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
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
