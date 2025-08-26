import React, { useState, useEffect } from "react";
import { HISTORY_TABLE_CONFIGS } from "@/shared/config/historyPageConfig";
import { getMyRequests } from "@/infrastructure/services/getMyRequests";
import { historyAdapter } from "@/infrastructure/adapters/historyAdapter/historyAdapter";
import { useErrorStore } from "@/store/errorStore";
import type { User } from "@auth/core/types";
import { historyTableConfig, type MentorshipData, type TableColumn } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";

interface HistoryTablesContainerProps {
  user?: User;
  showActions?: boolean;
}

const HistoryTablesContainer: React.FC<HistoryTablesContainerProps> = ({ user, showActions }) => {
  const [data, setData] = useState<MentorshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useErrorStore();

  const columns: TableColumn[] = showActions
    ? historyTableConfig
    : historyTableConfig.filter((col) => col.key !== "action");

  const fetchMyRequests = async () => {
    try {
      setIsLoading(true);
      const response = await getMyRequests();
      const adaptedData = historyAdapter(response.data);
      setData(adaptedData);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las mentorías");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [user]);

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(HISTORY_TABLE_CONFIGS).map(([key, config]) => (
        <DataTable
          key={key}
          title={config.title}
          columns={columns}
          data={data}
          emptyMessage={config.emptyMessage}
          loading={isLoading}
        />
      ))}
    </div>
  );
};

export default HistoryTablesContainer;
