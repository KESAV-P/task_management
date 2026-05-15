import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gray-950)",
        color: "var(--gray-50)",
        flexDirection: "column",
        gap: "1rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
        ✅ Phase 2 Complete!
      </h1>
      <p style={{ color: "var(--gray-400)", fontSize: "1.1rem" }}>
        Logged in as <strong style={{ color: "var(--brand-400)" }}>{session.user.email}</strong>
      </p>
      <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
        Full dashboard UI coming in Phase 4.
      </p>
    </div>
  );
}
