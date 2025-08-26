import { useEffect, useState } from "react";
import type { MentorshipData } from "../config/historyTableConfig";
import { useErrorStore } from "@/store/errorStore";
import { getMyRequests } from "@/infrastructure/services/getMyRequests";
import { historyAdapter } from "@/infrastructure/adapters/historyAdapter/historyAdapter";
import { useStore } from "@nanostores/react";
import { userStore } from "@/store/userStore";

export const useHistoryTables = () => {
  const [data, setData] = useState<MentorshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useErrorStore();
  const user = useStore(userStore);

  const fetchMyRequests = async () => {
    try {
      setIsLoading(true);
      const response = await getMyRequests();
      const adaptedData = historyAdapter(response.data);
      setData(adaptedData);
    } catch (err) {
      console.error("Error fetching history data:", err);
      setError("Error al cargar las mentorías");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  return { data, isLoading };
};
