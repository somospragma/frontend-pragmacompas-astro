import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Star } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorship: {
    participant: string;
    role: string;
    chapter: string;
    skills: string[];
  };
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, mentorship }: FeedbackModalProps) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Handle evaluation submission
    console.log("[v0] Evaluation submitted:", { score, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl max-w-md w-full p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Evaluación de Mentoría</h2>
            <p className="text-slate-400 text-sm">Evalúa la sesión completada</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Participant Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {mentorship.participant
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="text-white font-medium">{mentorship.participant}</h3>
            <p className="text-slate-400 text-sm">{mentorship.role}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-slate-200 font-medium mb-2">Skills trabajadas:</h4>
          <div className="flex flex-wrap gap-2">
            {mentorship.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Chapter */}
        <div className="mb-6">
          <h4 className="text-slate-200 font-medium mb-2">Capítulo:</h4>
          <p className="text-slate-300">{mentorship.chapter}</p>
        </div>

        {/* Score Rating */}
        <div className="mb-6">
          <h4 className="text-slate-200 font-medium mb-3">Puntuación (1-5):</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setScore(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredStar || score) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <h4 className="text-slate-200 font-medium mb-2">Comentario:</h4>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con esta mentoría..."
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 resize-none"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30 hover:text-red-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={score === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Evaluación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
