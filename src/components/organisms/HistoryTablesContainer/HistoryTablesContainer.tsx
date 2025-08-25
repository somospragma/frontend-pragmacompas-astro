import React from "react";
import HistoryTable from "@/components/organisms/HistoryTable/HistoryTable";
import { HISTORY_TABLE_CONFIGS } from "@/shared/config/historyPageConfig";
import type { User } from "@auth/core/types";

interface HistoryTablesContainerProps {
  user?: User;
}

const HistoryTablesContainer: React.FC<HistoryTablesContainerProps> = ({ user }) => {
  return (
    <div className="flex flex-col gap-12">
      {Object.entries(HISTORY_TABLE_CONFIGS).map(([key, config]) => (
        <HistoryTable
          key={key}
          title={config.title}
          emptyMessage={config.emptyMessage}
          showActions={config.showActions}
          status={config.status}
          user={user}
        />
      ))}
    </div>
  );
};

export default HistoryTablesContainer;
