import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SENIORITY_OPTIONS } from "@/shared/utils/enums/seniority";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getBasicUserStatistics, type UserStatistics } from "@/infrastructure/services/getBasicUserStatistics";
import { getChapters } from "@/infrastructure/services/getChapters";
import { postCreateUser } from "@/infrastructure/services/postCreateUser";
import { updateUser } from "@/infrastructure/services/updateUser";
import { updateUserProfile, userStore } from "@/store/userStore";
import { useStore } from "@nanostores/react";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ProfileForm = () => {
  const user = useStore(userStore);
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);

  const [formData, setFormData] = useState({
    chapterId: user.chapterId || "",
    seniority: user.seniority ? String(user.seniority) : "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
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

    getBasicUserStatistics()
      .then((stats) => {
        setStatistics(stats);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
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

    setLoading(true);

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
    } finally {
      setLoading(false);
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
              <div className="max-w-md">
                <Select
                  options={chapters.map((c) => ({ value: c.id, label: c.name }))}
                  value={formData.chapterId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, chapterId: value });
                    // Limpiar error cuando el usuario selecciona un valor
                    if (errors.chapterId) {
                      setErrors({ ...errors, chapterId: "" });
                    }
                  }}
                  placeholder="Selecciona un chapter"
                  className={errors.chapterId ? "border-destructive focus:ring-destructive" : ""}
                />
              </div>
              {errors.chapterId && <p className="text-sm text-destructive">{errors.chapterId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seniority" className="text-sm font-medium text-foreground">
                Seniority <span className="text-destructive">*</span>
              </Label>
              <div className="max-w-md">
                <Select
                  options={SENIORITY_OPTIONS}
                  value={formData.seniority}
                  onValueChange={(value) => {
                    setFormData({ ...formData, seniority: value });
                    if (errors.seniority) {
                      setErrors({ ...errors, seniority: "" });
                    }
                  }}
                  placeholder="Selecciona un nivel"
                  className={errors.seniority ? "border-destructive focus:ring-destructive" : ""}
                />
              </div>
              {errors.seniority && <p className="text-sm text-destructive">{errors.seniority}</p>}
            </div>
          </div>

          <div className="flex justify-start pt-4">
            <Button
              type="submit"
              className="px-8 py-2 h-10 text-sm rounded-full bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar Datos"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Statistics Section */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-6 text-foreground">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Mentorías
              </CardTitle>
              <p className="text-3xl font-bold text-foreground">{statistics?.mentorshipsGiven ?? "??"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Horas
              </CardTitle>
              <p className="text-3xl font-bold text-foreground">{statistics?.totalHours ?? "??"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Reseñas
              </CardTitle>
              <p className="text-3xl font-bold text-foreground">{statistics?.mentorshipsReceived ?? "??"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
