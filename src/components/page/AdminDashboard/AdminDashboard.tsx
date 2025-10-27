import { RoleRedirect } from "@/components/auth/RoleRedirect";
import DashboardStats from "@/components/organisms/DashboardStats/DashboardStats";
import MentorshipRequest from "../MentoShipRequest/MentorshipRequest";
import SectionHeader from "@/components/atoms/SectionHeader";
import { UserRole } from "@/shared/utils/enums/role";

interface Props {
  userRole?: UserRole;
  chapterId?: string;
}

export default function AdminDashboard({ userRole, chapterId }: Props) {
  return (
    <div className="space-y-10">
      <SectionHeader description="Solicitudes de Tutoría en Curso" />

      {/* Role Redirect Component */}
      {userRole && <RoleRedirect userRole={userRole}>{null}</RoleRedirect>}

      {/* Dashboard Stats */}
      {chapterId && <DashboardStats chapterId={chapterId} />}

      <MentorshipRequest isDashboard />
    </div>
  );
}
