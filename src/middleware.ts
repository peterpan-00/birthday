import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/login(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/unauthorized(.*)",
];

export const PROTECTED_ROUTE_PATTERNS = [
  "/music(.*)",
  "/birthday(.*)",
  "/auth-test(.*)",
  "/api/(.*)",
];

const isPublicRoute = createRouteMatcher(PUBLIC_ROUTE_PATTERNS);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = auth();

    if (!userId) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Authentication required." }, { status: 401 });
      }

      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set(
        "redirect_url",
        `${req.nextUrl.pathname}${req.nextUrl.search}`
      );
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|fontawesome|[\\w-]+\\.(?:png|jpg|jpeg|gif|svg|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest))).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
