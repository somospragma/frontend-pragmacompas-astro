import { useEffect, useState } from "react";
import { getUsers } from "@/infrastructure/services/getUsers";
import type { User } from "@/infrastructure/models/TutoringRequest";
import { UserRole } from "@/shared/utils/enums/role";

interface UseUsersByRoleParams {
  chapterId: string;
  userType: UserRole;
}

interface UseUsersByRoleReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsersByRole({ chapterId, userType }: UseUsersByRoleParams): UseUsersByRoleReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedUsers = await getUsers({
        rol: userType,
        chapterId: userType === UserRole.ADMINISTRADOR ? undefined : chapterId,
      });

      setUsers(fetchedUsers);
    } catch (err) {
      let errorMessage = "Error al cargar los usuarios";
      if (userType === UserRole.TUTEE) {
        errorMessage = "Error al cargar los Tutorados";
      } else if (userType === UserRole.TUTOR) {
        errorMessage = "Error al cargar los Tutores";
      } else if (userType === UserRole.ADMINISTRADOR) {
        errorMessage = "Error al cargar los Administradores";
      }

      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId || userType === UserRole.ADMINISTRADOR) {
      fetchUsers();
    }
  }, [chapterId, userType]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
