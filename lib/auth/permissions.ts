export const USER_ROLES = ["ADMIN", "BLOGGER"] as const;

export type UserRoleValue = (typeof USER_ROLES)[number];

export type Permission =
  | "admin.access"
  | "users.manage"
  | "blog.access"
  | "blog.create"
  | "blog.update.own"
  | "blog.manage"
  | "blog.publish"
  | "blog.delete";

const rolePermissions: Record<UserRoleValue, ReadonlySet<Permission>> = {
  ADMIN: new Set<Permission>([
    "admin.access",
    "users.manage",
    "blog.access",
    "blog.create",
    "blog.update.own",
    "blog.manage",
    "blog.publish",
    "blog.delete",
  ]),
  BLOGGER: new Set<Permission>([
    "blog.access",
    "blog.create",
    "blog.update.own",
  ]),
};

export function isUserRole(value: unknown): value is UserRoleValue {
  return USER_ROLES.includes(value as UserRoleValue);
}

export function hasPermission(
  role: UserRoleValue,
  permission: Permission,
): boolean {
  return rolePermissions[role].has(permission);
}
