import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getBasicUserStatistics, type UserStatistics } from "@/infrastructure/services/getBasicUserStatistics";
import { getChapters } from "@/infrastructure/services/getChapters";
import { updateUser } from "@/infrastructure/services/updateUser";
import { updateUserProfile, userStore } from "@/store/userStore";
import { useStore } from "@nanostores/react";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileForm() {
  const user = useStore(userStore);
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);

  const [formData, setFormData] = useState({
    chapterId: user.chapterId || "",
    seniority: user.seniority || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChapters().then((res) => setChapters(res as { id: string; name: string }[]));
    console.log("Fetching statistics for user:", user.id);
    getBasicUserStatistics(user?.id ?? "")
      .then((stats) => {
        console.log("Statistics received:", stats);
        setStatistics(stats);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, [user.id]);

  useEffect(() => {
    setFormData({
      chapterId: user.chapterId || "",
      seniority: user.seniority || "",
    });
  }, [user.chapterId, user.seniority]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.chapterId) newErrors.chapterId = "El capítulo es requerido";
    if (!formData.seniority) newErrors.seniority = "La seniority es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user.id) return;

    setLoading(true);
    try {
      await updateUser({
        id: user.id,
        chapterId: formData.chapterId,
        seniority: formData.seniority,
      });

      updateUserProfile({
        chapterId: formData.chapterId,
        seniority: formData.seniority,
      });

      alert("¡Perfil actualizado exitosamente!");
    } catch (err) {
      console.error(err);
      alert("Algo salió mal, por favor intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="w-full">
        {/* Profile Info - Horizontal Layout */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b">
          <Avatar
            src={user.avatar || undefined}
            fallback={getInitials(user.name)}
            size="xl"
            className="ring-2 ring-border"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name || "Usuario"}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email || "email@ejemplo.com"}</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chapter" className="text-sm font-medium text-foreground">
                Capítulo
              </Label>
              <div className="max-w-md">
                <Select
                  options={chapters.map((c) => ({ value: c.id, label: c.name }))}
                  value={formData.chapterId}
                  onValueChange={(value) => setFormData({ ...formData, chapterId: value })}
                  placeholder="Selecciona un capítulo"
                />
              </div>
              {errors.chapterId && <p className="text-sm text-destructive">{errors.chapterId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seniority" className="text-sm font-medium text-foreground">
                Seniority
              </Label>
              <div className="max-w-md">
                <Input
                  id="seniority"
                  type="text"
                  placeholder="Ej: Junior, Mid, Senior"
                  value={formData.seniority}
                  onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                  className="bg-background"
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
      {statistics ? (
        <div className="w-full">
          <h2 className="text-xl font-bold mb-6 text-foreground">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <CardTitle className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Mentorías
                </CardTitle>
                <p className="text-3xl font-bold text-foreground">{statistics.mentorshipsGiven || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <CardTitle className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Horas
                </CardTitle>
                <p className="text-3xl font-bold text-foreground">{statistics.totalHours || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <CardTitle className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Reseñas
                </CardTitle>
                <p className="text-3xl font-bold text-foreground">{statistics.mentorshipsReceived || 0}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h2 className="text-xl font-bold mb-6 text-foreground">Estadísticas</h2>
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      )}
    </div>
  );
}
