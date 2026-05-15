"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OAuthButtons from "@/components/auth/oauth-buttons";
import { CheckSquare, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <CheckSquare size={28} />
          </div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue to your workspace</p>
        </div>

        {/* Global error */}
        {state?.errors?.general && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{state.errors.general[0]}</span>
          </div>
        )}

        <form action={action} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <Label htmlFor="email" className="auth-label">
              Email address
            </Label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="auth-input"
                aria-describedby={state?.errors?.email ? "email-error" : undefined}
              />
            </div>
            {state?.errors?.email && (
              <p id="email-error" className="auth-field-error">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <Label htmlFor="password" className="auth-label">
                Password
              </Label>
              <Link href="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="auth-input"
                aria-describedby={state?.errors?.password ? "password-error" : undefined}
              />
            </div>
            {state?.errors?.password && (
              <p id="password-error" className="auth-field-error">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="auth-submit-btn"
            id="login-submit-btn"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <OAuthButtons isPending={isPending} />

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="auth-switch-link">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
