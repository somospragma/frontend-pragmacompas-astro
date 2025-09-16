import { useEffect, useState } from "react";
import { getUsers } from "@/infrastructure/services/getUsers";
import type { User } from "@/infrastructure/models/TutoringRequest";

interface Props {
  chapterId: string;
  userType: "Tutorado" | "Tutor";
  label: string;
  iconColor: "green" | "blue";
}

export default function UsersStats({ chapterId, userType, label, iconColor }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers({ rol: userType, chapterId });
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchUsers();
    }
  }, [chapterId, userType]);

  const activeUsers = users.length;

  const colorClasses = {
    green: {
      bg: "bg-green-500/10",
      text: "text-green-500",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
  };

  const iconPath =
    userType === "Tutorado"
      ? "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      : "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z";

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{label}</p>
          </div>
          <div className={`w-12 h-12 ${colorClasses[iconColor].bg} rounded-lg flex items-center justify-center`}>
            <svg
              className={`w-6 h-6 ${colorClasses[iconColor].text}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
