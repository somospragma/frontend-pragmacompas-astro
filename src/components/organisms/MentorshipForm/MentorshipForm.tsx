import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import { getSkills } from "@/infrastructure/services/getSkills";
import { getChapters } from "@/infrastructure/services/getChapters";
import { createTutoringRequest } from "@/infrastructure/services/createTutoringRequest";
import { userStore } from "@/store/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ROUTE_PATHS } from "@/shared/utils/enums/paths";

export default function MentorshipForm() {
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const user = useStore(userStore);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [chapter, setChapter] = useState("");
  const [needsDescription, setNeedsDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        const [skillsData, chaptersData] = await Promise.all([
          getSkills().catch((err) => {
            console.error("❌ Error loading skills:", err);
            return [];
          }),
          getChapters().catch((err) => {
            console.error("❌ Error loading chapters:", err);
            return [];
          }),
        ]);

        setSkills(skillsData);
        setChapters(chaptersData);
      } catch (error) {
        console.error("❌ MentorshipForm: Error loading data:", error);
        setDataError("Error cargando datos. Por favor recarga la página.");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (selectedSkills.length === 0) newErrors.skills = "Selecciona al menos una habilidad";
    if (!chapter) newErrors.chapter = "El capítulo es requerido";
    if (!needsDescription) newErrors.needsDescription = "La descripción es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Error de validación", {
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    if (!user.userId) {
      toast.error("Error de autenticación", {
        description: "Debes estar autenticado para enviar una solicitud",
      });
      return;
    }

    setLoading(true);
    try {
      const requestPayload = {
        tuteeId: user.userId,
        skillIds: selectedSkills.length > 0 ? selectedSkills : undefined,
        needsDescription,
      };

      await createTutoringRequest(requestPayload);

      toast.success("¡Solicitud enviada exitosamente!", {
        description: "Te redirigiremos a la página principal",
      });

      // Reset form
      setSelectedSkills([]);
      setChapter("");
      setNeedsDescription("");

      const homeUrl = ROUTE_PATHS.HOME.getHref();
      window.location.href = homeUrl;
    } catch {
      toast.error("Error al enviar solicitud", {
        description: "Algo salió mal, por favor intenta de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mostrar estado de carga
  if (dataLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Cargando formulario...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar error si hay problemas cargando datos
  if (dataError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <p className="text-destructive">{dataError}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Recargar página
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-6 w-full">
        <CardTitle className="text-2xl font-bold text-center">Solicitar Mentoría</CardTitle>
        <CardDescription className="text-center text-base mt-2">
          Completa el formulario para solicitar una sesión de mentoría.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chapter" className="text-sm font-medium">
              Capítulo
            </Label>
            <Select
              options={chapters.map((c) => ({ value: c.id, label: c.name }))}
              value={chapter}
              onValueChange={setChapter}
              placeholder="Selecciona un capítulo"
            />
            {errors.chapter && <p className="text-sm text-destructive">{errors.chapter}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills" className="text-sm font-medium">
              Habilidades
            </Label>
            <MultiSelect
              options={skills.map((s) => ({ value: s.id, label: s.name }))}
              value={selectedSkills}
              onValueChange={setSelectedSkills}
              placeholder="Selecciona habilidades..."
            />
            {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas
            </Label>
            <Textarea
              id="notes"
              placeholder="Describe en qué te gustaría recibir ayuda..."
              value={needsDescription}
              onChange={(e) => setNeedsDescription(e.target.value)}
              rows={4}
              className="text-sm resize-none"
            />
            {errors.needsDescription && <p className="text-sm text-destructive">{errors.needsDescription}</p>}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-6 h-10 text-base"
            disabled={loading}
            size="default"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Solicitud"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
