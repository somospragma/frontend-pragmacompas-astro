import { Card, CardContent } from "@/components/ui/card";
import { renderState } from "@/shared/utils/helpers/renderState";

interface UserInfo {
  firstName?: string;
  lastName?: string;
  chapter?: {
    name: string;
  };
}

interface Skill {
  name: string;
}

interface MentorshipItemCardProps {
  id: string;
  user: UserInfo;
  status: string;
  description: string;
  skills: Skill[];
  additionalInfo?: string;
  onClick: () => void;
}

export default function MentorshipItemCard({
  id,
  user,
  status,
  description,
  skills,
  additionalInfo,
  onClick,
}: MentorshipItemCardProps) {
  const getInitials = () => {
    const firstInitial = user.firstName?.charAt(0) || "?";
    const lastInitial = user.lastName?.charAt(0) || "?";
    return `${firstInitial}${lastInitial}`;
  };

  const getFullName = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Usuario desconocido";
  };

  const getSkillsText = () => {
    return skills.map((skill) => skill.name).join(", ");
  };

  return (
    <Card
      key={id}
      className="bg-card border border-border cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 min-w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">{getInitials()}</span>
            </div>
            <div>
              <h3 className="text-foreground font-semibold">{getFullName()}</h3>
              <p className="text-muted-foreground text-xs">
                {user.chapter?.name}
                {additionalInfo && ` | ${additionalInfo}`}
              </p>
              <p className="text-muted-foreground text-xs">
                {description} - Habilidades:&nbsp;{getSkillsText()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">{renderState(status)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
