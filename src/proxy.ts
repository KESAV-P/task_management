import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes (require authentication)
const protectedRoutes = ["/dashboard"];
// Public-only routes (redirect to dashboard if already logged in)
const publicOnlyRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Read the NextAuth JWT session cookie (name depends on whether https is used)
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  const isAuthenticated = !!sessionCookie?.value;

  // Unauthenticated user trying to access protected route → redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user on login/signup → redirect to dashboard
  if (isPublicOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all routes EXCEPT:
     * - api routes (handled by NextAuth route handler)
     * - _next/static, _next/image (Next.js internals)
     * - public assets (favicon, images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
