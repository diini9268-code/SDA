import { NextResponse, type NextRequest } from "next/server";
import { authorizeAuthenticatedRequest } from "@/lib/auth/authorization";
import { hasPermission } from "@/lib/auth/permissions";

function isAdminApi(pathname: string): boolean {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const authorization = authorizeAuthenticatedRequest(request.headers.get("cookie"));

  if (authorization.authorized) {
    const isBlogArea =
      pathname === "/admin/blog" ||
      pathname.startsWith("/admin/blog/") ||
      pathname === "/api/admin/blog" ||
      pathname.startsWith("/api/admin/blog/");
    const permitted = isBlogArea
      ? hasPermission(authorization.session.role, "blog.access")
      : hasPermission(authorization.session.role, "admin.access");

    if (permitted) return NextResponse.next();

    if (isAdminApi(pathname)) {
      return NextResponse.json({ error: "Insufficient permission." }, { status: 403 });
    }

    const bloggerUrl = request.nextUrl.clone();
    bloggerUrl.pathname = "/admin/blog";
    bloggerUrl.search = "";
    return NextResponse.redirect(bloggerUrl);
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
