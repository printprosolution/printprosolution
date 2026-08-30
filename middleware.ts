import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Guards every route under /admin/dashboard. If there is no valid NextAuth
 * session, the visitor is bounced back to /admin (the login gate) instead
 * of ever seeing dashboard content or data.
 *
 * Note: the public "#admin" hash trick lives in the browser only (hash
 * fragments never reach the server), so it is handled client-side in
 * <AdminHashRedirect /> — this middleware is what actually enforces
 * security for the real /admin/dashboard pages and API routes.
 */
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin",
    },
  }
);

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
