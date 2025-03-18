import { UserCardAiTools } from "@/components/organisms/UserCard/UserCardAiTools";
import { UserCardContactInfo } from "@/components/organisms/UserCard/UserCardContactInfo";
import { UserCardDatesInfo } from "@/components/organisms/UserCard/UserCardDatesInfo";
import { UserCardHeader } from "@/components/organisms/UserCard/UserCardHeader";
import { UserCardMainInfo } from "@/components/organisms/UserCard/UserCardMainInfo";
import { UserCardSkills } from "@/components/organisms/UserCard/UserCardSkills";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Account } from "@/shared/entities/account";
import type { User } from "@/shared/entities/user";

interface Props {
  user: User;
  account: Account;
  bannerColorClass?: string;
}

export const UserCard = ({ user, account, bannerColorClass = "bg-orange-200" }: Props) => {
  return (
    <Card
      key={user.id}
      className="animate-appear overflow-hidden border-0 shadow-lg max-w-96 min-w-96 hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
    >
      <div className={`h-24 w-full ${bannerColorClass}`} />

      <UserCardHeader user={user} account={account} />

      <CardHeader className="pt-2 pb-0">
        <UserCardMainInfo user={user} />
        <UserCardContactInfo user={user} />
      </CardHeader>

      <CardContent className="space-y-4">
        <UserCardDatesInfo user={user} />
        <UserCardAiTools user={user} />
        <UserCardSkills user={user} />
      </CardContent>
    </Card>
  );
};
