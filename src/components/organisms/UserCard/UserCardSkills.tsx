import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import type { User } from "@/shared/entities/user";

interface Props {
  user: User;
}

export const UserCardSkills = ({ user }: Props) => {
  return (
    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Code className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium dark:text-gray-200">Skills Frontend</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {user.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};
