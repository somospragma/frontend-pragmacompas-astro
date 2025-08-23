import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MentorshipData {
  participant: string;
  role: string;
  status: string;
  scheduledDate: string;
  chapter: string;
  skills: string[];
  action: string;
}

interface Props {
  data: MentorshipData[];
  title?: string;
}

const HistoryTable: React.FC<Props> = ({ data, title }: Props) => {
  const getStatusBadgeClasses = (status: string) => {
    const statusClasses: Record<string, string> = {
      ["Active"]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      ["Pendiente reunión"]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return statusClasses[status] || "";
  };

  const getVariantButtonClasses = (
    action: string
  ): "default" | "link" | "destructive" | "secondary" | "outline" | "ghost" | null | undefined => {
    const actionClasses: Record<string, "default" | "link" | "destructive" | "secondary" | "outline" | "ghost"> = {
      ["Cancelar"]: "destructive",
    };
    return actionClasses[action] || "default";
  };

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold text-foreground">Active Mentorships</h2>}
      <div className="bg-table rounded-xl border border-border overflow-hidden ">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-primary/10">
                <TableHead className="text-foreground font-semibold py-4 px-6">Participante</TableHead>
                <TableHead className="text-foreground font-semibold py-4 px-6">Rol</TableHead>
                <TableHead className="text-foreground font-semibold py-4 px-6">Estado</TableHead>
                <TableHead className="text-foreground font-semibold py-4 px-6">Fecha Programada</TableHead>
                <TableHead className="text-foreground font-semibold py-4 px-6">Chapter</TableHead>
                <TableHead className="text-foreground font-semibold py-4 px-6">Habilidades</TableHead>
                <TableHead className="text-foreground font-semibold py-4 px-6">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((mentorship, index) => (
                <TableRow key={index} className="border-border hover:bg-accent transition-colors">
                  <TableCell className="text-foreground font-medium py-6 px-6">{mentorship.participant}</TableCell>
                  <TableCell className="text-foreground py-6 px-6">{mentorship.role}</TableCell>
                  <TableCell className="text-foreground py-6 px-6">
                    <Badge
                      variant="outline"
                      className={`font-medium px-3 py-1 rounded-full text-xs ${getStatusBadgeClasses(mentorship.status)}`}
                    >
                      {mentorship.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground py-6 px-6">{mentorship.scheduledDate}</TableCell>
                  <TableCell className="text-foreground py-6 px-6">{mentorship.chapter}</TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="flex flex-col gap-1">
                      {mentorship.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="text-foreground text-sm">
                          {skill}
                          {skillIndex < mentorship.skills.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <Button variant={getVariantButtonClasses(mentorship.action)} size="sm">
                      {mentorship.action}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
