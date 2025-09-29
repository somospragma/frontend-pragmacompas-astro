import { useMemo } from "react";
import { ROLE_HIERARCHY, UserRole } from "@/shared/utils/enums/role";
import { Permission } from "../utils/enums/permission";
import { hasPermission } from "../utils/helpers/hasPermission";

export const usePermissions = (role: UserRole | string) => {
  return useMemo(
    () => ({
      can: (permission: Permission) => hasPermission(role, permission),

      canCompleteTutoring: () => {
        return hasPermission(role, Permission.COMPLETE_TUTORING);
      },

      canViewActUrl: () => {
        return hasPermission(role, Permission.VIEW_ACT_URL);
      },

      roleLevel: ROLE_HIERARCHY[role as UserRole],
    }),
    [role]
  );
};
