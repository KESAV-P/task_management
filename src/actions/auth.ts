"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema, loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

// ─────────────────────────────────────────────
//  Form state types
// ─────────────────────────────────────────────

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[];
  };
  message?: string;
  success?: boolean;
} | undefined;

// ─────────────────────────────────────────────
//  Sign Up
// ─────────────────────────────────────────────

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validated = signupSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as NonNullable<AuthFormState>["errors"],
    };
  }

  const { name, email, password } = validated.data;

  try {
    // Check if email is already taken
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        errors: { email: ["An account with this email already exists."] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  } catch {
    return {
      errors: { general: ["Something went wrong. Please try again."] },
    };
  }

  // Sign in immediately after creating account
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { general: ["Account created but login failed. Please log in manually."] },
      };
    }
    throw error; // NEXT_REDIRECT must be re-thrown
  }
}

// ─────────────────────────────────────────────
//  Log In
// ─────────────────────────────────────────────

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = loginSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as NonNullable<AuthFormState>["errors"],
    };
  }

  const { email, password } = validated.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            errors: { general: ["Invalid email or password."] },
          };
        default:
          return {
            errors: { general: ["Something went wrong. Please try again."] },
          };
      }
    }
    throw error; // NEXT_REDIRECT must be re-thrown
  }
}

// ─────────────────────────────────────────────
//  Sign Out
// ─────────────────────────────────────────────

export async function signOutAction() {
  const { signOut: nextAuthSignOut } = await import("@/lib/auth");
  await nextAuthSignOut({ redirectTo: "/login" });
}
