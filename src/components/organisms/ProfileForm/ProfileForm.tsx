import { Avatar } from "@/components/ui/avatar";
import { SENIORITY_OPTIONS } from "@/shared/utils/enums/seniority";
import { Label } from "@/components/ui/label";
import { getChapters } from "@/infrastructure/services/getChapters";
import { postCreateUser } from "@/infrastructure/services/postCreateUser";
import { updateUser } from "@/infrastructure/services/updateUser";
import { updateUserProfile, userStore } from "@/store/userStore";
import { useStore } from "@nanostores/react";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ProfileForm = () => {
  const user = useStore(userStore);

  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    chapterId: user.chapterId || "",
    seniority: user.seniority ? String(user.seniority) : "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [initialValidationShown, setInitialValidationShown] = useState(false);

  useEffect(() => {
    if (!initialValidationShown && user.id) {
      const initialErrors: { [key: string]: string } = {};
      if (!user.chapterId) initialErrors.chapterId = "El chapter es requerido";
      if (!user.seniority) initialErrors.seniority = "La seniority es requerida";
      setErrors(initialErrors);
      setInitialValidationShown(true);
    }
  }, [user.id, user.chapterId, user.seniority, initialValidationShown]);

  useEffect(() => {
    getChapters().then((res) => {
      setChapters(res as { id: string; name: string }[]);
    });
  }, [user.id]);

  useEffect(() => {
    setFormData({
      chapterId: user.chapterId || "",
      seniority: user.seniority ? String(user.seniority) : "",
    });
  }, [user.chapterId, user.seniority]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.chapterId) newErrors.chapterId = "El chapter es requerido";
    if (!formData.seniority) newErrors.seniority = "La seniority es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUser = async () => {
    if (!user) return;

    postCreateUser({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email || "",
      googleUserId: user.googleId || "",
      chapterId: formData.chapterId || "",
      seniority: formData.seniority,
      rol: "Tutorado",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (user?.userId === "") {
      await createUser();
      return;
    }
    try {
      await updateUser({
        id: user.userId ?? "",
        chapterId: formData.chapterId,
        seniority: formData.seniority,
      });

      updateUserProfile({
        chapterId: formData.chapterId,
        seniority: formData.seniority,
      });

      // Limpiar errores después de actualización exitosa
      setErrors({});

      toast.success("¡Perfil actualizado exitosamente!", {
        description: "Tus datos han sido guardados correctamente.",
        duration: 4000,
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
      toast.error("Error al actualizar perfil", {
        description: "Algo salió mal, por favor intenta de nuevo más tarde.",
        duration: 4000,
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Profile Section */}
      <div className="w-full">
        {/* Profile Info - Horizontal Layout */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b">
          <Avatar
            src={user?.image || undefined}
            alt={getInitials(user?.firstName || null)}
            fallback={getInitials(user?.firstName || null)}
            size="xl"
            className="ring-2 ring-border"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user?.firstName || "Usuario"}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user?.email || "email@ejemplo.com"}</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chapter" className="text-sm font-medium text-foreground">
                Chapter <span className="text-destructive">*</span>
              </Label>
              <div className="max-w-md p-2 border rounded-md ">
                <p>{chapters.find((c) => c.id === formData.chapterId)?.name}</p>
              </div>
              {errors.chapterId && <p className="text-sm text-destructive">{errors.chapterId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seniority" className="text-sm font-medium text-foreground">
                Seniority <span className="text-destructive">*</span>
              </Label>
              <div className="max-w-md p-2 border rounded-md ">
                <p>{SENIORITY_OPTIONS.find((c) => c.value === formData.seniority)?.label}</p>
              </div>
              {errors.seniority && <p className="text-sm text-destructive">{errors.seniority}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
