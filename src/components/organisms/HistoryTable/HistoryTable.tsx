import React from "react";
import DataTable from "@/components/organisms/DataTable/DataTable";
import { historyTableConfig, type MentorshipData, type TableColumn } from "@/shared/config/historyTableConfig";

interface Props {
  title: string;
  emptyMessage: string;
  showActions?: boolean;
  data: MentorshipData[];
  loading: boolean;
}

const HistoryTable: React.FC<Props> = ({ title, emptyMessage, showActions = true, data, loading }) => {
  const columns: TableColumn[] = showActions
    ? historyTableConfig
    : historyTableConfig.filter((col) => col.key !== "action");

  return <DataTable title={title} columns={columns} data={data} emptyMessage={emptyMessage} loading={loading} />;
};

export default HistoryTable;
