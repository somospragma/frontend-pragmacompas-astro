import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { User } from "@/shared/entities/user";

interface Props {
  user: User;
}

export const UserCardAiTools = ({ user }: Props) => {
  return (
    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-medium dark:text-gray-200">Herramientas IA</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {user.aiTools.map((tool) => (
          <Badge
            key={tool}
            variant="outline"
            className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
          >
            {tool}
          </Badge>
        ))}
      </div>
    </div>
  );
};
