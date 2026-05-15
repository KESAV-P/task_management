import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | TaskFlow",
    default: "TaskFlow",
  },
  description: "Sign in to your TaskFlow account to manage your tasks.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}
