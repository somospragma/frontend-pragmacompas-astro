import type { User } from "@/shared/entities/user";
import { UserCard } from "@/components/organisms/UserCard/UserCard";
import type { Account } from "@/shared/entities/account";

interface Props {
  users: User[];
  accountsRecord: Record<string, Account>;
}

export const UserCardsGrid = ({ users, accountsRecord }: Props) => {
  return (
    <section className="flex flex-wrap gap-6 justify-center">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          account={accountsRecord[user.accountId]}
          bannerColorClass={accountsRecord[user.accountId]?.bannerColorClass}
        />
      ))}
    </section>
  );
};
