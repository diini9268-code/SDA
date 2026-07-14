import { NextResponse, type NextRequest } from "next/server";
import { authorizeAdminRequest } from "@/lib/auth/authorization";

function isAdminApi(pathname: string): boolean {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const authorization = authorizeAdminRequest(request.headers.get("cookie"));

  if (authorization.authorized) {
    return NextResponse.next();
  }

  if (isAdminApi(pathname)) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/admin/login";
  redirectUrl.search = "";
  redirectUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
