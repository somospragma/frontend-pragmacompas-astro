import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { useState } from "react";

interface MentorshipRequest {
  id: string;
  tutee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    chapter: {
      id: string;
      name: string;
    };
    rol: string;
  };
  skills: {
    id: string;
    name: string;
  }[];
  needsDescription: string;
  requestStatus: string;
}

interface Props {
  mentorshipRequests: MentorshipRequest[];
  title?: string;
}

export default function MentorshipTable({ mentorshipRequests, title = "Solicitudes de Mentoría" }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos los estados");

  const handleRequestClick = (request: MentorshipRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const filteredRequests = mentorshipRequests.filter((request) => {
    const fullName = `${request.tutee.firstName} ${request.tutee.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tutee.chapter.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "Todos los estados" || request.requestStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <div className="flex gap-4">
            <input
              className="bg-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type="text"
              placeholder="Buscar solicitudes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="bg-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>Todos los estados</option>
              <option>Enviada</option>
              <option>Aceptada</option>
              <option>Rechazada</option>
              <option>En progreso</option>
              <option>Completada</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="bg-card border border-border cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleRequestClick(request)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {request.tutee.firstName.charAt(0)}
                        {request.tutee.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">
                        {request.tutee.firstName} {request.tutee.lastName}
                      </h3>
                      <p className="text-muted-foreground text-sm">{request.tutee.chapter.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {request.skills.map((skill) => skill.name).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        request.requestStatus === "Enviada"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : request.requestStatus === "Aceptada"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : request.requestStatus === "Rechazada"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {request.requestStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron solicitudes que coincidan con los filtros.</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitud de Mentoría</DialogTitle>
            <DialogDescription>Detalles de la solicitud de mentoría</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {selectedRequest.tutee.firstName.charAt(0)}
                    {selectedRequest.tutee.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedRequest.tutee.firstName} {selectedRequest.tutee.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedRequest.tutee.chapter.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.tutee.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Skills solicitadas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRequest.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Descripción de necesidades:</span>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRequest.needsDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Estado:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedRequest.requestStatus === "Enviada"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : selectedRequest.requestStatus === "Aceptada"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : selectedRequest.requestStatus === "Rechazada"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {selectedRequest.requestStatus}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="destructive" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
