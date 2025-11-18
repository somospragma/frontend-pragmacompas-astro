import { useCallback, useEffect, useId, useMemo, useState } from "react";
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

/**
 * Form component for creating mentorship requests with real-time validation and accessibility features.
 *
 * @component
 * @example
 * ```tsx
 * <MentorshipForm />
 * ```
 */
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

  const formId = useId();
  const chapterFieldId = useId();
  const skillsFieldId = useId();
  const notesFieldId = useId();
  const chapterErrorId = useId();
  const skillsErrorId = useId();
  const notesErrorId = useId();

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

  const chapterOptions = useMemo(() => chapters.map((c) => ({ value: c.id, label: c.name })), [chapters]);

  const skillOptions = useMemo(() => skills.map((s) => ({ value: s.id, label: s.name })), [skills]);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (selectedSkills.length === 0) newErrors.skills = "Selecciona al menos una habilidad";
    if (!chapter) newErrors.chapter = "El chapter es requerido";
    if (!needsDescription) newErrors.needsDescription = "La descripción es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedSkills.length, chapter, needsDescription]);

  const handleSubmit = useCallback(async () => {
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

      setSelectedSkills([]);
      setChapter("");
      setNeedsDescription("");

      const homeUrl = ROUTE_PATHS.HISTORY.getHref();
      globalThis.location.href = homeUrl;
    } catch {
      toast.error("Error al enviar solicitud", {
        description: "Algo salió mal, por favor intenta de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  }, [validate, user.userId, selectedSkills, needsDescription]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNeedsDescription(e.target.value);
  }, []);

  if (dataLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto" aria-busy="true" aria-live="polite">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" aria-hidden="true" />
            <p className="text-muted-foreground">Cargando formulario...</p>
            <span className="sr-only">Loading form data, please wait</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dataError) {
    return (
      <Card className="w-full max-w-2xl mx-auto" role="alert" aria-live="assertive">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <p className="text-destructive">{dataError}</p>
            <Button onClick={() => globalThis.location.reload()} variant="outline">
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
        <CardTitle id={formId} className="text-2xl font-bold text-center">
          Solicitar tutoría
        </CardTitle>
        <CardDescription className="text-center text-base mt-2">
          Completa el formulario para solicitar una sesión de tutoría.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form className="space-y-6" aria-labelledby={formId} role="form">
          <div className="space-y-2">
            <Label htmlFor={chapterFieldId} className="text-sm font-medium">
              Chapter
            </Label>
            <Select
              options={chapterOptions}
              value={chapter}
              onValueChange={setChapter}
              placeholder="Selecciona un chapter"
              aria-invalid={!!errors.chapter}
              aria-describedby={errors.chapter ? chapterErrorId : undefined}
            />
            {errors.chapter && (
              <p id={chapterErrorId} className="text-sm text-destructive" role="alert">
                {errors.chapter}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={skillsFieldId} className="text-sm font-medium">
              Habilidades
            </Label>
            <MultiSelect
              options={skillOptions}
              value={selectedSkills}
              onValueChange={setSelectedSkills}
              placeholder="Selecciona habilidades..."
              aria-invalid={!!errors.skills}
              aria-describedby={errors.skills ? skillsErrorId : undefined}
            />
            {errors.skills && (
              <p id={skillsErrorId} className="text-sm text-destructive" role="alert">
                {errors.skills}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={notesFieldId} className="text-sm font-medium">
              Notas
            </Label>
            <Textarea
              id={notesFieldId}
              placeholder="Describe en qué te gustaría recibir ayuda..."
              value={needsDescription}
              onChange={handleTextareaChange}
              rows={4}
              className="text-sm resize-none"
              aria-invalid={!!errors.needsDescription}
              aria-describedby={errors.needsDescription ? notesErrorId : undefined}
            />
            {errors.needsDescription && (
              <p id={notesErrorId} className="text-sm text-destructive" role="alert">
                {errors.needsDescription}
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-6 h-10 text-base"
            disabled={loading}
            size="default"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Enviando...
                <span className="sr-only">Submitting mentorship request</span>
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
