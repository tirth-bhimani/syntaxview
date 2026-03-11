import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible middleware — checks for a NextAuth session cookie
 * without importing Node.js modules (no stream, crypto, etc.).
 * Protected routes require the user to be signed in.
 */

const PROTECTED_PREFIXES = [
  "/array",
  "/stack",
  "/queue",
  "/linked-list",
  "/binary-tree",
  "/graph",
  "/hash-table",
  "/settings",
  "/api/visualizations",
  "/api/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  // NextAuth v5 (auth.js) uses "authjs.session-token"
  // NextAuth v4 used "next-auth.session-token"
  // Check both + their __Secure- HTTPS variants
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Only run middleware on routes that actually need it
export const config = {
  matcher: [
    "/array/:path*",
    "/stack/:path*",
    "/queue/:path*",
    "/linked-list/:path*",
    "/binary-tree/:path*",
    "/graph/:path*",
    "/hash-table/:path*",
    "/settings/:path*",
    "/api/visualizations/:path*",
    "/api/settings/:path*",
  ],
};
