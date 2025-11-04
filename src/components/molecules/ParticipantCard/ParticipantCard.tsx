import React, { useMemo } from "react";
import type { User } from "@/infrastructure/models/TutoringRequest";
import type { UserRole } from "@/shared/utils/enums/role";

/**
 * ParticipantCard component displays participant information in a card format.
 * Shows avatar with initials, full name, chapter, role, and email.
 *
 * @component
 * @example
 * ```tsx
 * <ParticipantCard
 *   user={userData}
 *   role={UserRole.TUTOR}
 * />
 * ```
 */

interface ParticipantCardProps {
  readonly user: User;
  readonly role?: UserRole;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ user, role }) => {
  const initials = useMemo(() => {
    if (!user?.firstName || !user?.lastName) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  }, [user?.firstName, user?.lastName]);

  const fullName = useMemo(() => {
    if (!user?.firstName || !user?.lastName) return "";
    return `${user.firstName} ${user.lastName}`;
  }, [user?.firstName, user?.lastName]);

  const chapterInfo = useMemo(() => {
    const chapterName = user?.chapter?.name || "";
    if (!role) return chapterName;
    return `${chapterName} | ${role}`;
  }, [user?.chapter?.name, role]);

  const containerClassName = useMemo(() => "flex items-center gap-4", []);

  const avatarContainerClassName = useMemo(
    () => "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center",
    []
  );

  const initialsClassName = useMemo(() => "text-primary font-semibold text-lg", []);

  const nameClassName = useMemo(() => "text-lg font-semibold text-foreground", []);

  const chapterClassName = useMemo(() => "text-muted-foreground", []);

  const emailClassName = useMemo(() => "text-sm text-muted-foreground", []);

  const ariaLabel = useMemo(() => {
    const name = fullName || "Usuario";
    const chapterText = user?.chapter?.name ? `, ${user.chapter.name}` : "";
    const roleText = role ? `, ${role}` : "";
    return `Participante: ${name}${chapterText}${roleText}`;
  }, [fullName, user?.chapter?.name, role]);

  return (
    <article className={containerClassName} aria-label={ariaLabel}>
      <div className={containerClassName}>
        <div className={avatarContainerClassName} role="img" aria-label={`Avatar de ${fullName}`}>
          <span className={initialsClassName} aria-hidden="true">
            {initials}
          </span>
        </div>
        <div>
          <h3 className={nameClassName}>{fullName}</h3>
          <p className={chapterClassName}>{chapterInfo}</p>
          <p className={emailClassName}>{user?.email}</p>
        </div>
      </div>
    </article>
  );
};
