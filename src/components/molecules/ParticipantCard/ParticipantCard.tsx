import React from "react";
import type { User } from "@/infrastructure/models/TutoringRequest";
import type { UserRole } from "@/shared/utils/enums/role";

interface ParticipantCardProps {
  user: User;
  role?: UserRole;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ user, role }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">
            {user?.firstName.charAt(0)}
            {user?.lastName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{`${user?.firstName} ${user?.lastName}`}</h3>
          <p className="text-muted-foreground">{`${user?.chapter?.name} ${role && "|"} ${role}`}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};
