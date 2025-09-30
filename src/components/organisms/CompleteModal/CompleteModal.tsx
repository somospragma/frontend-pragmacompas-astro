import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";

interface CompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplete: (documentUrl: string) => Promise<void>;
}

const CompleteModal: React.FC<CompleteModalProps> = ({ isOpen, onClose, onSubmitComplete }) => {
  const [formData, setFormData] = useState({
    documentUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ documentUrl: "" });
  };

  const handleSubmit = async () => {
    if (formData.documentUrl.trim() === "") {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitComplete(formData.documentUrl);
      resetForm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || formData.documentUrl.trim() === "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalización de Tutoría</DialogTitle>
          <DialogDescription>Evalúa la sesión completada</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Acta:</h4>
            <Input
              type="url"
              value={formData.documentUrl}
              onChange={(e) => updateFormData("documentUrl", e.target.value)}
              placeholder="https://..."
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Finalizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteModal;
