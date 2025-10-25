import StatCard from "@/components/atoms/StatCard";
import { Users2 } from "lucide-react";
import { UserRole } from "@/shared/utils/enums/role";
import { useUsersByRole } from "@/shared/hooks/useUsersByRole";

interface Props {
  chapterId: string;
  userType: UserRole;
  label: string;
  iconColor: "green" | "blue" | "yellow";
}

export default function UsersStats({ chapterId, userType, label, iconColor }: Props) {
  const { users, loading } = useUsersByRole({ chapterId, userType });

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
    yellow: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        value={activeUsers}
        label={label}
        icon={<Users2 />}
        iconBgColor={colorClasses[iconColor].bg}
        iconColor={colorClasses[iconColor].text}
      />
    </div>
  );
}
