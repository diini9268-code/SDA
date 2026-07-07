import { cookies } from "next/headers";
import { authorizeAdminRequest } from "@/lib/auth/authorization";

export async function requireAdminSession() {
  const cookieHeader = (await cookies()).toString();
  const authorization = authorizeAdminRequest(cookieHeader);

  return authorization.authorized ? authorization.session : null;
}
