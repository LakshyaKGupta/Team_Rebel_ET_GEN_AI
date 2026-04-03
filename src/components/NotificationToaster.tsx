"use client";

import { useEffect, useState } from "react";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function NotificationToaster() {
  const { notifications, markAsRead } = useNotifications();
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      const isRecent = new Date().getTime() - new Date(latest.timestamp).getTime() < 5000;
      if (!latest.read && isRecent) {
        setActiveToast(latest);
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:bottom-4 md:right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-sm w-full mx-auto md:mx-0 pointer-events-auto cursor-pointer"
            onClick={() => {
              markAsRead(activeToast.id);
              setActiveToast(null);
              router.push('/notifications');
            }}
          >
            <div className="flex gap-4 items-start">
              <div className="bg-[#E8501A]/10 p-2 rounded-full text-[#E8501A] shrink-0 mt-0.5">
                <Bell size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate">
                  {activeToast.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                  {activeToast.message}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveToast(null);
                }}
                className="p-1 -mr-2 -mt-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
