import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mentorship = {
  participant: "Alex Rodriguez",
  role: "Mentee",
  status: "Completada",
  email: "test@pragma.com.co",
  scheduledDate: "July 15, 2024",
  chapter: "Frontend Development",
  skills: ["React", "TypeScript", "Next.js"],
  action: "Ver detalle",
  completedDate: "July 15, 2024",
  duration: "1h 30min",
  mentorFeedback: {
    score: 5,
    comment:
      "Excelente sesión. Alex mostró gran comprensión de los conceptos de React y TypeScript. Hicimos un buen progreso en la implementación de componentes reutilizables y manejo de estado. Muy motivado y con buenas preguntas.",
  },
  menteeFeedback: {
    score: 4,
    comment:
      "Increíble mentoría! Mi mentor fue muy claro explicando conceptos complejos y me ayudó a entender mejor las mejores prácticas de React. Los ejemplos prácticos fueron muy útiles. Definitivamente aplicaré todo lo aprendido en mi proyecto.",
  },
  document: {
    name: "Acta_Mentoria_React_TypeScript_15Jul2024.pdf",
    url: "https://example.com/documents/acta-mentoria-alex-rodriguez-15jul2024.pdf",
  },
};

const TutoringDetailModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const renderStars = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= score ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
          />
        ))}
      </div>
    );
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-foreground">Detalle de Tutoría</DialogTitle>
          <DialogDescription>Sesión completada - Feedback completo</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {mentorship.participant
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{mentorship.participant}</h3>
              <p className="text-muted-foreground">{mentorship.role}</p>
              <p className="text-sm text-muted-foreground">{mentorship.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Habilidades trabajadas:</h4>
            <div className="flex flex-wrap gap-2">
              {mentorship.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Información de la Sesión</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fecha programada:</span>
                <p className="text-foreground">{mentorship.scheduledDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha completada:</span>
                <p className="text-foreground">{mentorship.completedDate}</p>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50"
                  onClick={() => window.open(mentorship.document!.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Documento
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Feedback de la Sesión</h4>

            <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-foreground">Feedback del Tutor</h5>
                <div className="flex items-center gap-2">
                  {renderStars(mentorship.mentorFeedback.score)}
                  <span className="text-foreground text-sm ml-2">{mentorship.mentorFeedback.score}/5</span>
                </div>
              </div>
              <p className="text-foreground leading-relaxed text-sm">{mentorship.mentorFeedback.comment}</p>
            </div>

            <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-foreground">Feedback del Tutorado</h5>
                <div className="flex items-center gap-2">
                  {renderStars(mentorship.menteeFeedback.score)}
                  <span className="text-foreground text-sm ml-2">{mentorship.menteeFeedback.score}/5</span>
                </div>
              </div>
              <p className="text-foreground leading-relaxed text-sm">{mentorship.menteeFeedback.comment}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringDetailModal;
