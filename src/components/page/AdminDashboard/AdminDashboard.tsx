import { RoleRedirect } from "@/components/auth/RoleRedirect";
import DashboardStats from "@/components/organisms/DashboardStats/DashboardStats";
import type { UserRole } from "@/infrastructure/models/TutoringRequest";
import MentorshipRequest from "../MentoShipRequest/MentorshipRequest";

interface Props {
  userName?: string;
  userRole?: UserRole;
  chapterId?: string;
}

export default function AdminDashboard({ userName, userRole, chapterId }: Props) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard del Administrador</h1>
          <p className="text-gray-600">Panel de control administrativo - {userName}</p>
        </div>

        {/* Role Redirect Component */}
        {userRole && <RoleRedirect userRole={userRole}>{null}</RoleRedirect>}

        {/* Dashboard Stats */}
        {chapterId && <DashboardStats chapterId={chapterId} />}

        <MentorshipRequest isDashboard />
      </div>
    </main>
  );
}
