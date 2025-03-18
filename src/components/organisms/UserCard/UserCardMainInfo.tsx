import { MapPin } from "lucide-react";
import type { User } from "@/shared/entities/user";

interface Props {
  user: User;
}

export const UserCardMainInfo = ({ user }: Props) => {
  return (
    <div>
      <h3 className="text-xl font-bold dark:text-white">{user.name}</h3>
      <p className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
        <MapPin className="h-3 w-3" /> {user.location}
      </p>
    </div>
  );
};
