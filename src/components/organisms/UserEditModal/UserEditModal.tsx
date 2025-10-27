import { useState, useEffect } from "react";
import type { User, Chapter } from "@/infrastructure/models/TutoringRequest";
import { getChapters } from "@/infrastructure/services/getChapters";
import { updateUser } from "@/infrastructure/services/updateUser";
import { updateUserRole } from "@/infrastructure/services/updateUserRole";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/molecules/Dialog/Dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/shared/utils/enums/role";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: () => void;
}

export default function UserEditModal({ isOpen, onClose, user, onUserUpdated }: UserEditModalProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    chapterId: "",
    seniority: "",
    rol: "",
    slackId: "",
    activeTutoringLimit: "",
  });

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const chaptersData = await getChapters();
        setChapters(chaptersData);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && chapters.length === 0) {
      fetchChapters();
    }
  }, [isOpen, chapters.length]);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        chapterId: user.chapter?.id || user.chapterId || "",
        seniority: user.seniority || "",
        rol: user.rol || "",
        slackId: user.slackId || "",
        activeTutoringLimit: user.activeTutoringLimit?.toString() || "",
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const activeTutoringLimit = formData.activeTutoringLimit ? parseInt(formData.activeTutoringLimit) : 0;

      await updateUser({
        id: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        chapterId: formData.chapterId,
        seniority: formData.seniority,
        activeTutoringLimit,
      });

      if (formData.rol && formData.rol !== user.rol) {
        await updateUserRole({
          id: user.id,
          role: formData.rol as "Tutor" | "Tutorado" | "Administrador",
        });
      }

      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-2xl h-[100dvh] sm:h-[90vh] flex flex-col gap-0 p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0 text-left">
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica la información del usuario
            <span className="block mt-2 text-xs">
              <span className="font-medium">Email:</span> {user.email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="pr-4 pt-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Información Básica</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nombre</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none"
                    placeholder="Nombre del usuario"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Apellido</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none"
                    placeholder="Apellido del usuario"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Asignación</h3>

              <div className="space-y-2">
                <Label htmlFor="chapter" className="text-sm font-medium">
                  Chapter
                </Label>
                <Select
                  placeholder={loading ? "Cargando chapters..." : "Selecciona un chapter"}
                  options={chapters.map((chapter) => ({
                    value: chapter.id,
                    label: chapter.name,
                  }))}
                  value={formData.chapterId}
                  onValueChange={(value: string) => handleInputChange("chapterId", value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seniority" className="text-sm font-medium">
                  Seniority
                </Label>
                <Select
                  placeholder="Selecciona un seniority"
                  options={[
                    { value: "Junior", label: "Junior" },
                    { value: "Mid", label: "Mid" },
                    { value: "Senior", label: "Senior" },
                  ]}
                  value={formData.seniority}
                  onValueChange={(value: string) => handleInputChange("seniority", value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol" className="text-sm font-medium">
                  Rol
                </Label>
                <Select
                  placeholder="Selecciona un rol"
                  options={[
                    { value: UserRole.TUTEE, label: "Tutorado" },
                    { value: UserRole.TUTOR, label: "Tutor" },
                    { value: UserRole.ADMINISTRADOR, label: "Administrador" },
                  ]}
                  value={formData.rol}
                  onValueChange={(value: string) => handleInputChange("rol", value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Información Adicional</h3>

              <div className="space-y-2">
                <Label htmlFor="slackId" className="text-sm font-medium">
                  Slack ID
                </Label>
                <Input
                  id="slackId"
                  type="text"
                  value={formData.slackId}
                  disabled
                  className="bg-muted cursor-not-allowed"
                  placeholder="U123456789"
                />
                <p className="text-xs text-muted-foreground">Este campo no se puede editar</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeTutoringLimit" className="text-sm font-medium">
                  Límite de Tutorías Activas
                </Label>
                <Input
                  id="activeTutoringLimit"
                  type="number"
                  min="0"
                  value={formData.activeTutoringLimit}
                  onChange={(e) => handleInputChange("activeTutoringLimit", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
