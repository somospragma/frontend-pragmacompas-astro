import { PERMISSION_REQUIREMENTS, type Permission } from "../enums/permission";
import { ROLE_HIERARCHY, type UserRole } from "../enums/role";

export const hasPermission = (userRole: UserRole | string, permission: Permission): boolean => {
  const requiredRole = PERMISSION_REQUIREMENTS[permission];
  const userLevel = ROLE_HIERARCHY[userRole as UserRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel <= requiredLevel;
};
