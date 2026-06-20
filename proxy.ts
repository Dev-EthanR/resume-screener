import { auth } from "@/lib/auth";

const authPaths = ["/auth/signin", "/auth/register", "/"];

export const proxy = auth((req) => {
  if (!req.auth && !authPaths.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/register|$).*)",
  ],
};
