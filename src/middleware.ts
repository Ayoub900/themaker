import { NextResponse, type NextRequest } from "next/server";

import { dashboard } from "@/config/site";
import { verifySessionToken } from "@/lib/session-token";

/**
 * Gate for dashboard navigations.
 *
 * This runs on the Edge and only verifies the cookie signature — it never
 * touches the database. It is a redirect convenience, not the security
 * boundary: every dashboard page and server action calls `requireSession`
 * for itself, because actions are separate entry points.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(dashboard.sessionCookie)?.value;
  const session = await verifySessionToken(token);

  if (pathname.startsWith("/dashboard")) {
    if (session) return NextResponse.next();

    const loginUrl = new URL(dashboard.loginPath, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);
    // Clear an expired or tampered cookie so the loop cannot repeat.
    if (token) response.cookies.delete(dashboard.sessionCookie);
    return response;
  }

  // Already signed in? Skip the login screen.
  if (pathname === dashboard.loginPath && session) {
    return NextResponse.redirect(new URL(dashboard.path, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
