import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { BriefingProvider } from "@/context/BriefingContext";

export const metadata: Metadata = {
  title: "My ET - AI Personalized News",
  description: "Your personalized news experience with AI-powered briefings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <BriefingProvider>
            {children}
          </BriefingProvider>
        </UserProvider>
      </body>
    </html>
  );
}
