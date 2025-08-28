import { useCallback, useEffect, useState } from "react";
import type { MentorshipData } from "../config/historyTableConfig";
import { getMyRequests } from "@/infrastructure/services/getMyRequests";
import { historyAdapter } from "@/infrastructure/adapters/historyAdapter/historyAdapter";

export const useHistoryTables = () => {
  const [data, setData] = useState<MentorshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyRequests();
      const adaptedData = historyAdapter(response.data);
      setData(adaptedData);
    } catch (error) {
      console.error("Error fetching history data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    refetch: fetchData,
  };
};
