"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OAuthButtons from "@/components/auth/oauth-buttons";
import {
  CheckSquare,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function SignupForm() {
  const [state, action, isPending] = useActionState(signUpAction, undefined);

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
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Start managing tasks like a pro — it&apos;s free
          </p>
        </div>

        {/* Global error */}
        {state?.errors?.general && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{state.errors.general[0]}</span>
          </div>
        )}

        <form action={action} className="auth-form">
          {/* Full Name */}
          <div className="auth-field">
            <Label htmlFor="name" className="auth-label">
              Full name
            </Label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Alex Johnson"
                autoComplete="name"
                className="auth-input"
                aria-describedby={state?.errors?.name ? "name-error" : undefined}
              />
            </div>
            {state?.errors?.name && (
              <p id="name-error" className="auth-field-error">
                {state.errors.name[0]}
              </p>
            )}
          </div>

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
            <Label htmlFor="password" className="auth-label">
              Password
            </Label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 chars with a number"
                autoComplete="new-password"
                className="auth-input"
                aria-describedby={
                  state?.errors?.password ? "password-error" : undefined
                }
              />
            </div>
            {state?.errors?.password && (
              <ul id="password-error" className="auth-field-error-list">
                {state.errors.password.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <Label htmlFor="confirmPassword" className="auth-label">
              Confirm password
            </Label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="auth-input"
                aria-describedby={
                  state?.errors?.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
              />
            </div>
            {state?.errors?.confirmPassword && (
              <p id="confirm-password-error" className="auth-field-error">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="auth-submit-btn"
            id="signup-submit-btn"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="auth-divider">
          <span>or sign up with</span>
        </div>

        <OAuthButtons isPending={isPending} />

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login" className="auth-switch-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
