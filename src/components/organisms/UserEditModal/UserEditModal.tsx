import { useState, useEffect, useMemo, useCallback } from "react";
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

/**
 * UserEditModal component provides a form to edit user information including
 * basic details, chapter assignment, role, and tutoring limits.
 *
 * @component
 * @example
 * ```tsx
 * <UserEditModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   user={selectedUser}
 *   onUserUpdated={() => refetchUsers()}
 * />
 * ```
 */

interface UserEditModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly user: User | null;
  readonly onUserUpdated: () => void;
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

  const seniorityOptions = useMemo(
    () => [
      { value: "Junior", label: "Junior" },
      { value: "Mid", label: "Mid" },
      { value: "Senior", label: "Senior" },
    ],
    []
  );

  const roleOptions = useMemo(
    () => [
      { value: UserRole.TUTEE, label: "Tutorado" },
      { value: UserRole.TUTOR, label: "Tutor" },
      { value: UserRole.ADMINISTRADOR, label: "Administrador" },
    ],
    []
  );

  const chapterOptions = useMemo(
    () =>
      chapters.map((chapter) => ({
        value: chapter.id,
        label: chapter.name,
      })),
    [chapters]
  );

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

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) return;

    try {
      setSaving(true);

      const activeTutoringLimit = formData.activeTutoringLimit ? Number.parseInt(formData.activeTutoringLimit) : 0;

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
  }, [user, formData, onUserUpdated, onClose]);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-full sm:max-w-2xl h-[100dvh] sm:h-[90vh] flex flex-col gap-0 p-4 sm:p-6"
        aria-labelledby="user-edit-title"
        aria-describedby="user-edit-description"
      >
        <DialogHeader className="flex-shrink-0 text-left">
          <DialogTitle id="user-edit-title">Editar Usuario</DialogTitle>
          <DialogDescription id="user-edit-description">
            Modifica la información del usuario
            <div className="block mt-2 text-xs">
              <span className="font-medium">Email:</span> {user.email}
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <form
            className="pr-4 pt-4 space-y-6"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Formulario de edición de usuario"
          >
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium text-foreground">Información Básica</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Nombre del usuario"
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Apellido del usuario"
                    aria-required="true"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium text-foreground">Asignación</legend>

              <div className="space-y-2">
                <Label htmlFor="chapter" className="text-sm font-medium">
                  Chapter
                </Label>
                <Select
                  placeholder={loading ? "Cargando chapters..." : "Selecciona un chapter"}
                  options={chapterOptions}
                  value={formData.chapterId}
                  onValueChange={(value: string) => handleInputChange("chapterId", value)}
                  aria-label="Seleccionar chapter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seniority" className="text-sm font-medium">
                  Seniority
                </Label>
                <Select
                  placeholder="Selecciona un seniority"
                  options={seniorityOptions}
                  value={formData.seniority}
                  onValueChange={(value: string) => handleInputChange("seniority", value)}
                  aria-label="Seleccionar seniority"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol" className="text-sm font-medium">
                  Rol
                </Label>
                <Select
                  placeholder="Selecciona un rol"
                  options={roleOptions}
                  value={formData.rol}
                  onValueChange={(value: string) => handleInputChange("rol", value)}
                  aria-label="Seleccionar rol"
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium text-foreground">Información Adicional</legend>

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
                  aria-readonly="true"
                />
                <p className="text-xs text-muted-foreground" id="slackId-help">
                  Este campo no se puede editar
                </p>
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
                  aria-label="Límite de tutorías activas"
                />
              </div>
            </fieldset>
          </form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving} aria-label="Cancelar edición">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} aria-label={saving ? "Guardando cambios" : "Guardar cambios"}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
