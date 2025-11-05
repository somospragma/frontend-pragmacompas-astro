import { useMemo } from "react";
import StatCard from "@/components/atoms/StatCard";
import { Users2 } from "lucide-react";
import { UserRole } from "@/shared/utils/enums/role";
import { useUsersByRole } from "@/shared/hooks/useUsersByRole";

/**
 * UsersStats component displays statistics about users filtered by role and chapter.
 * Shows a loading skeleton while fetching data, then renders a StatCard with user count.
 *
 * @component
 * @example
 * ```tsx
 * <UsersStats
 *   chapterId="123"
 *   userType={UserRole.TUTOR}
 *   label="Active Tutors"
 *   iconColor="green"
 * />
 * ```
 */

interface UsersStatsProps {
  readonly chapterId: string;
  readonly userType: UserRole;
  readonly label: string;
  readonly iconColor: "green" | "blue" | "yellow";
}

export default function UsersStats({ chapterId, userType, label, iconColor }: UsersStatsProps) {
  const { users, loading } = useUsersByRole({ chapterId, userType });

  const activeUsers = useMemo(() => users.length, [users.length]);

  const colorClasses = useMemo(
    () => ({
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
    }),
    []
  );

  const iconBgColor = useMemo(() => colorClasses[iconColor].bg, [colorClasses, iconColor]);
  const iconTextColor = useMemo(() => colorClasses[iconColor].text, [colorClasses, iconColor]);

  const gridClassName = useMemo(() => "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", []);
  const skeletonCardClassName = useMemo(() => "bg-card border border-border rounded-lg p-6 animate-pulse", []);
  const skeletonLineClassName = useMemo(() => "h-4 bg-muted rounded w-3/4 mb-2", []);
  const skeletonValueClassName = useMemo(() => "h-8 bg-muted rounded w-1/2", []);

  if (loading) {
    return (
      <section className={gridClassName} aria-label={`Loading ${label} statistics`} aria-busy="true">
        <div className={skeletonCardClassName} role="status" aria-label="Loading user statistics">
          <div className={skeletonLineClassName} aria-hidden="true"></div>
          <div className={skeletonValueClassName} aria-hidden="true"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  return (
    <section className={gridClassName} aria-label={`${label} statistics`}>
      <StatCard
        value={activeUsers}
        label={label}
        icon={<Users2 aria-hidden="true" />}
        iconBgColor={iconBgColor}
        iconColor={iconTextColor}
      />
    </section>
  );
}
