import type { Metadata } from "next";
import { Syne, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { BriefingProvider } from "@/context/BriefingContext";
import { ChatProvider } from "@/context/ChatContext";
import { ChatBotWidget } from "@/components/ChatBotWidget";
import { NotificationProvider } from "@/context/NotificationContext";

const syne = Syne({ 
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "ET AI - Decision Intelligence Engine",
  description: "Turn news into your next move. AI-powered insights for investors, founders, and professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <UserProvider>
          <NotificationProvider>
            <BriefingProvider>
              <ChatProvider>
                {children}
                <ChatBotWidget />
              </ChatProvider>
            </BriefingProvider>
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
