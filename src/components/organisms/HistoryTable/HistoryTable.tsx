import React, { useState, useEffect } from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { TableHeaderRow } from "@/components/molecules/Table/TableHeaderRow";
import { TableDataRow } from "@/components/molecules/Table/TableDataRow";
import { TableEmptyState } from "@/components/atoms/Table/TableEmptyState";
import { TableLoadingState } from "@/components/atoms/Table/TableLoadingState";
import { getMyRequests } from "@/infrastructure/services/getMyRequests";
import { historyAdapter } from "@/infrastructure/adapters/historyAdapter/historyAdapter";
import { historyTableStyles, type MentorshipData } from "./HistoryTable.styles";
import type { User } from "@auth/core/types";
import { useErrorStore } from "@/store/errorStore";

interface Props {
  title: string;
  emptyMessage: string;
  user?: User;
}

const HistoryTable: React.FC<Props> = ({ title, emptyMessage, user: userSession }) => {
  const [data, setData] = useState<MentorshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error, setError } = useErrorStore();

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
  }, [userSession]);

  const shouldShowError = !isLoading && error;
  const shouldShowEmpty = !isLoading && data.length === 0 && !error;
  const shouldShowData = !isLoading && data.length > 0;

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}

      <div className={historyTableStyles.container}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableHeaderRow />
            </TableHeader>
            <TableBody>
              {isLoading && <TableLoadingState />}
              {shouldShowEmpty && <TableEmptyState message={emptyMessage} />}
              {shouldShowError && <TableEmptyState message={"Error al cargar los datos"} />}
              {shouldShowData &&
                data.map((row, index) => <TableDataRow key={`${row.participant}-${index}`} row={row} index={index} />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
