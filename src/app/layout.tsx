import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow — Real-Time Task Management",
    template: "%s | TaskFlow",
  },
  description:
    "TaskFlow is a real-time task management app. Create, organise, and track tasks with a beautiful Kanban board.",
  keywords: ["task management", "kanban", "productivity", "real-time"],
  authors: [{ name: "TaskFlow" }],
  openGraph: {
    type: "website",
    title: "TaskFlow — Real-Time Task Management",
    description: "Manage tasks beautifully in real time.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              color: "#f1f5f9",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
