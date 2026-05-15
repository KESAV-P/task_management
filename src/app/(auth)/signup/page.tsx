import type { Metadata } from "next";
import SignupForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free TaskFlow account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
