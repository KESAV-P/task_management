import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardClient 
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }} 
    />
  );
}
