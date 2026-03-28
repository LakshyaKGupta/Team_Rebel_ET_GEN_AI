import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/onboarding"];
const publicRoutes = [
  "/",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/auth/preferences",
  "/api/profile",
  "/api/preferences",
  "/api/market/search",
  "/api/interests/verify",
  "/api/ai/briefing",
  "/api/ai/chat",
  "/api/ask",
  "/api/news",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!authToken;

  const isApiProtected = pathname.startsWith("/api") && 
    !publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
  
  if (isApiProtected && !isAuthenticated) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
