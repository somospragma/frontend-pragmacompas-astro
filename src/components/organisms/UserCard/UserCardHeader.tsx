import { Badge } from "@/components/ui/badge";
import { seniorityLevels } from "@/shared/utils/constants/seniority-map";
import type { Account } from "@/shared/entities/account";
import type { User } from "@/shared/entities/user";

interface Props {
  user: User;
  account: Account;
}

export const UserCardHeader = ({ user, account }: Props) => {
  return (
    <div className="flex justify-between px-6 -mt-12">
      <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={`${user.name} avatar`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex gap-1 mt-14">
        <Badge className={`bg-gray-700 font-medium rounded-2xl h-9`}>{account?.name}</Badge>
        <Badge className={`${seniorityLevels[user.seniority].color} h-9 font-bold rounded-2xl w-28`}>
          {seniorityLevels[user.seniority].icon} {seniorityLevels[user.seniority].name}
        </Badge>
      </div>
    </div>
  );
};
