export const historyTableStyles = {
  container: "bg-table rounded-xl border border-border overflow-hidden",
  header: {
    row: "border-border bg-primary/10",
    cell: "text-foreground font-semibold py-4 px-6",
  },
  body: {
    row: "border-border hover:bg-accent transition-colors",
    cell: "text-foreground py-6 px-6",
    cellMedium: "text-foreground font-medium py-6 px-6",
    skillsCell: "py-6 px-6",
  },
  badge: {
    base: "font-medium px-3 py-1 rounded-full text-xs",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-foreground",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-foreground",
    rejected: "bg-error-50 text-error-700 dark:bg-error-900 dark:text-foreground",
  },
};
