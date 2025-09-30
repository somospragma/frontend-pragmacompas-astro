import type { Tutoring } from "@/infrastructure/models/Tutoring";
import { useMemo, useState } from "react";
import { ADMIN_MENTORSHIP_STATE_FILTERS } from "../utils/enums/mentorshipsStateFilter";

export const useTutoringFilters = (data: Tutoring[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos los estados");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const fullName = `${item.tutee.firstName} ${item.tutee.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tutee.chapter.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === "Todos los estados" || item.status === selectedStatus;

      const matchesByRol = ADMIN_MENTORSHIP_STATE_FILTERS.includes(item.status);

      return matchesSearch && matchesStatus && matchesByRol;
    });
  }, [data, searchTerm, selectedStatus]);

  return { searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, filteredData };
};
