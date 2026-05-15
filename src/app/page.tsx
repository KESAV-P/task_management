import { redirect } from "next/navigation";

// Root "/" redirects to dashboard; proxy.ts will redirect
// unauthenticated users from /dashboard to /login automatically.
export default function RootPage() {
  redirect("/dashboard");
}
