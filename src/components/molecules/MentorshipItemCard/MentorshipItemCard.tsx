import { Card, CardContent } from "@/components/ui/card";
import { renderState } from "@/shared/utils/helpers/renderState";
import { useCallback, useMemo } from "react";

interface UserInfo {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly chapter?: {
    readonly name: string;
  };
}

interface Skill {
  readonly name: string;
}

interface MentorshipItemCardProps {
  readonly id: string;
  readonly user: UserInfo;
  readonly status: string;
  readonly description: string;
  readonly skills: Skill[];
  readonly additionalInfo?: string;
  readonly onClick: () => void;
}

/**
 * MentorshipItemCard displays information about a mentorship session
 * @param id - Unique identifier for the mentorship
 * @param user - User information (tutor or tutee)
 * @param status - Current status of the mentorship
 * @param description - Description or objectives of the mentorship
 * @param skills - Array of skills covered in the mentorship
 * @param additionalInfo - Optional additional information to display
 * @param onClick - Callback function when card is clicked
 */
export default function MentorshipItemCard({
  id,
  user,
  status,
  description,
  skills,
  additionalInfo,
  onClick,
}: MentorshipItemCardProps) {
  // Memoize initials calculation
  const initials = useMemo(() => {
    const firstInitial = user.firstName?.charAt(0) || "?";
    const lastInitial = user.lastName?.charAt(0) || "?";
    return `${firstInitial}${lastInitial}`;
  }, [user.firstName, user.lastName]);

  // Memoize full name calculation
  const fullName = useMemo(() => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Usuario desconocido";
  }, [user.firstName, user.lastName]);

  // Memoize skills text
  const skillsText = useMemo(() => {
    return skills.map((skill) => skill.name).join(", ");
  }, [skills]);

  // Memoize chapter info text
  const chapterInfo = useMemo(() => {
    const chapterName = user.chapter?.name || "";
    return additionalInfo ? `${chapterName} | ${additionalInfo}` : chapterName;
  }, [user.chapter?.name, additionalInfo]);

  // Memoize ARIA label
  const ariaLabel = useMemo(() => {
    return `Mentoría: ${fullName}, ${status}, ${description}`;
  }, [fullName, status, description]);

  // Memoize click handler
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  // Memoize keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <Card
      key={id}
      className="bg-card border border-border cursor-pointer hover:bg-accent transition-colors"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 min-w-12 rounded-full bg-primary/10 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-primary font-semibold">{initials}</span>
            </div>
            <div>
              <h3 className="text-foreground font-semibold">{fullName}</h3>
              <p className="text-muted-foreground text-xs">{chapterInfo}</p>
              <p className="text-muted-foreground text-xs">
                {description} - Habilidades:&nbsp;{skillsText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4" aria-label={`Estado: ${status}`}>
            {renderState(status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
