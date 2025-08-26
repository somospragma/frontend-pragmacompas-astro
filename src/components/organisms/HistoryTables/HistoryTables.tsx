import React, { useState, useEffect } from "react";
import { getMyRequests } from "@/infrastructure/services/getMyRequests";
import { historyAdapter } from "@/infrastructure/adapters/historyAdapter/historyAdapter";
import { useErrorStore } from "@/store/errorStore";
import type { User } from "@auth/core/types";
import { HISTORY_TABLE_CONFIG, type MentorshipData } from "@/shared/config/historyTableConfig";
import DataTable from "../DataTable/DataTable";
import { HISTORY_PAGE_CONFIG } from "@/shared/config/historyPageConfig";

interface HistoryTablesContainerProps {
  user?: User;
}

const HistoryTablesContainer: React.FC<HistoryTablesContainerProps> = ({ user }) => {
  const [data, setData] = useState<MentorshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useErrorStore();

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
      {Object.entries(HISTORY_PAGE_CONFIG).map(([key, config]) => {
        const columns = config.showActions
          ? HISTORY_TABLE_CONFIG
          : HISTORY_TABLE_CONFIG.filter((col) => col.key !== "action");

        const filteredData = data.filter((item) => config.status.some((status) => status === item.status));

        return (
          <DataTable
            key={key}
            title={config.title}
            columns={columns}
            data={filteredData}
            emptyMessage={config.emptyMessage}
            loading={isLoading}
          />
        );
      })}
    </div>
  );
};

export default HistoryTablesContainer;
