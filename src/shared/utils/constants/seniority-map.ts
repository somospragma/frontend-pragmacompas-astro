import { SENIORITY } from "@/shared/entities/user";

export const seniorityLevels = {
  [SENIORITY.TRAINEE]: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "🍼",
    name: "Trainee",
  },
  [SENIORITY.JUNIOR]: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: "🌱",
    name: "Junior",
  },
  [SENIORITY.MID]: {
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: "⭐",
    name: "SemiSenior",
  },
  [SENIORITY.SENIOR]: {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: "🔥",
    name: "Senior",
  },
  [SENIORITY.MASTER]: {
    color: "bg-purple-700 text-purple-100 dark:bg-purple-900 dark:text-purple-300",
    icon: "👑",
    name: "Master",
  },
};
