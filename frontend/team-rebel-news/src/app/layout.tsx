import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
