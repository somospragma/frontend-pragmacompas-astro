import { RoleRedirect } from "@/components/auth/RoleRedirect";
import DashboardStats from "@/components/organisms/DashboardStats/DashboardStats";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";
import MentorshipRequest from "../MentoShipRequest/MentorshipRequest";

interface Props {
  userRole?: UserRole;
  chapterId?: string;
}

export default function AdminDashboard({ userRole, chapterId }: Props) {
  return (
    <div className="space-y-10">
      {/* Role Redirect Component */}
      {userRole && <RoleRedirect userRole={userRole}>{null}</RoleRedirect>}

      {/* Dashboard Stats */}
      {chapterId && <DashboardStats chapterId={chapterId} />}

      <MentorshipRequest isDashboard />
    </div>
  );
}
