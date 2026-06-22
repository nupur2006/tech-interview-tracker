export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - API auth routes (NextAuth handlers)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/auth).*)",
  ],
};
