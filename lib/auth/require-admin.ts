import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookies";
import { hasPermission, type Permission } from "@/lib/auth/permissions";
import { verifySessionToken, type AuthenticatedSession } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db/prisma";

export async function requireAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const tokenSession = token ? verifySessionToken(token) : null;

  if (!tokenSession) return null;

  const user = await getPrismaClient().user.findUnique({
    where: { id: tokenSession.sub },
    select: { id: true, email: true, fullName: true, role: true, isActive: true },
  });

  if (!user?.isActive) return null;

  return {
    ...tokenSession,
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export async function requirePermission(
  permission: Permission,
): Promise<AuthenticatedSession | null> {
  const session = await requireAuthenticatedSession();
  return session && hasPermission(session.role, permission) ? session : null;
}

export async function requireAdminSession() {
  return requirePermission("admin.access");
}

export async function requireBlogSession() {
  return requirePermission("blog.access");
}

export async function requireAdminPageSession() {
  const session = await requireAuthenticatedSession();
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "admin.access")) redirect("/admin/blog");
  return session;
}

export async function requireBlogPageSession() {
  const session = await requireAuthenticatedSession();
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "blog.access")) redirect("/admin/login");
  return session;
}
