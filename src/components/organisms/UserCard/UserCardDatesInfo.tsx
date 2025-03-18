import { dateAdapter } from "@/infrastructure/adapters/dateAdapter/dateAdapter";
import type { User } from "@/shared/entities/user";
import { Cake, Calendar } from "lucide-react";

interface Props {
  user: User;
}

export const UserCardDatesInfo = ({ user }: Props) => {
  const startDateFormated = dateAdapter(user.startDate).format("DD [de] MMMM, YYYY");
  const startDateRelative = dateAdapter(user.startDate).fromNow();
  const birthdayFormated = dateAdapter(user.birthday).format("DD [de] MMMM, YYYY");

  return (
    <div>
      <div className="flex items-center gap-2">
        <Cake className="h-4 w-4 text-yellow-500" />
        <span className="text-sm dark:text-gray-300">{birthdayFormated}</span>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-amber-500" />
        <span className="text-sm dark:text-gray-300">
          {startDateFormated} - {startDateRelative}
        </span>
      </div>
    </div>
  );
};
