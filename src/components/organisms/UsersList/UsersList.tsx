import { updateUserRole } from "@/infrastructure/services/updateUserRole";
import type { User } from "@/infrastructure/models/TutoringRequest";
import UserViewModal from "@/components/organisms/UserViewModal/UserViewModal";
import RoleChangeModal from "@/components/organisms/RoleChangeModal/RoleChangeModal";
import UserEditModal from "@/components/organisms/UserEditModal/UserEditModal";
import { SENIORITY_OPTIONS } from "@/shared/utils/enums/seniority";
import { UserRole } from "@/shared/utils/enums/role";
import { useUsersByRole } from "@/shared/hooks/useUsersByRole";
import { useModalState } from "@/shared/hooks/useModalState";

interface Props {
  chapterId: string;
  userType: UserRole;
  title: string;
}

export default function UsersList({ chapterId, userType, title }: Props) {
  const { users, loading, error, refetch } = useUsersByRole({ chapterId, userType });

  const {
    isOpen: viewModalOpen,
    selectedItem: selectedViewUser,
    openModal: openViewModal,
    closeModal: closeViewModal,
  } = useModalState<User>();

  const {
    isOpen: roleChangeModalOpen,
    selectedItem: selectedRoleUser,
    openModal: openRoleChangeModal,
    closeModal: closeRoleChangeModal,
  } = useModalState<User>();

  const {
    isOpen: editModalOpen,
    selectedItem: selectedEditUser,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModalState<User>();

  const getSeniorityInfo = (seniorityValue: string | undefined) => {
    if (!seniorityValue) {
      return {
        label: "No definido",
        colorClasses: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      };
    }

    const valueAsString = String(seniorityValue);
    const option = SENIORITY_OPTIONS.find((opt) => opt.value === valueAsString);

    if (!option) {
      return {
        label: seniorityValue,
        colorClasses: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      };
    }

    const getColorClasses = (value: string) => {
      const numValue = parseInt(value);

      // Trainee (1-3): Light blue/cyan - beginner level
      if (numValue >= 1 && numValue <= 3) {
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      }
      // Junior (4-6): Blue - early career
      if (numValue >= 4 && numValue <= 6) {
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      }
      // Advance (7-9): Purple - mid-level
      if (numValue >= 7 && numValue <= 9) {
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      }
      // Senior (10-12): Indigo - senior level
      if (numValue >= 10 && numValue <= 12) {
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      }
      // Master (13-15): Emerald - expert level
      if (numValue >= 13 && numValue <= 15) {
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      }

      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    };

    return {
      label: option.label,
      colorClasses: getColorClasses(valueAsString),
    };
  };

  const handleViewUser = (user: User) => {
    openViewModal(user);
  };

  const handleEditUser = (user: User) => {
    openEditModal(user);
  };

  const handleChangeRole = (user: User) => {
    openRoleChangeModal(user);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole });
      await refetch();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {userType === "Tutorado" ? "Mentee" : "Mentor"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Seniority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium mb-2">
                      No hay {userType === "Tutorado" ? "mentees" : "mentores"} disponibles
                    </p>
                    <p className="text-sm">
                      Los {userType === "Tutorado" ? "mentees" : "mentores"} aparecerán aquí cuando se registren.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                if (userType === "Tutor" && user.rol !== "Tutor") return null; // Skip tutors without a role
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={
                            "w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full " +
                            "flex items-center justify-center text-white font-semibold text-sm"
                          }
                        >
                          {user.firstName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const seniorityInfo = getSeniorityInfo(user.seniority);
                        return (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${seniorityInfo.colorClasses}`}
                          >
                            {seniorityInfo.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span
                          className={
                            "inline-flex px-2 py-1 text-xs font-semibold rounded-full " +
                            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          }
                        >
                          {user.rol || userType}
                        </span>
                        <button
                          onClick={() => handleChangeRole(user)}
                          className={
                            "text-xs text-blue-600 hover:text-blue-900 " +
                            "dark:text-blue-400 dark:hover:text-blue-300 underline"
                          }
                        >
                          Cambiar
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <UserViewModal isOpen={viewModalOpen} onClose={closeViewModal} user={selectedViewUser} />
      <RoleChangeModal
        isOpen={roleChangeModalOpen}
        onClose={closeRoleChangeModal}
        user={selectedRoleUser}
        onRoleChange={handleRoleChange}
      />
      <UserEditModal isOpen={editModalOpen} onClose={closeEditModal} user={selectedEditUser} onUserUpdated={refetch} />
    </div>
  );
}
