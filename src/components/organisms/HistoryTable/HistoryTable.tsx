import React, { useState, useEffect } from "react";
import DataTable from "@/components/organisms/DataTable/DataTable";
import { getMyRequests } from "@/infrastructure/services/getMyRequests";
import { historyAdapter } from "@/infrastructure/adapters/historyAdapter/historyAdapter";
import { historyTableConfig, type MentorshipData, type TableColumn } from "./HistoryTable.styles";
import type { User } from "@auth/core/types";
import { useErrorStore } from "@/store/errorStore";
import { Status } from "@/shared/utils/enums/status";

interface Props {
  title: string;
  emptyMessage: string;
  user?: User;
  showActions?: boolean;
  status?: Status[];
}

const HistoryTable: React.FC<Props> = ({ title, emptyMessage, user: userSession, showActions = true, status }) => {
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

      const filteredData = status
        ? adaptedData.filter((item) => {
            return status.includes(item.status as Status);
          })
        : adaptedData;

      setData(filteredData);
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
  }, [userSession, status]);

  return <DataTable title={title} columns={columns} data={data} emptyMessage={emptyMessage} loading={isLoading} />;
};

export default HistoryTable;
