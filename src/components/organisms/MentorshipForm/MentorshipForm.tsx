import { useEffect, useState } from "react";
import { getSkills } from "@/infrastructure/services/getSkills";
import { getChapters } from "@/infrastructure/services/getChapters";
import { createTutoringRequest } from "@/infrastructure/services/createTutoringRequest";
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

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [chapter, setChapter] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSkills().then((res) => setSkills(res as { id: string; name: string }[]));
    getChapters().then((res) => setChapters(res as { id: string; name: string }[]));
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (selectedSkills.length === 0) newErrors.skills = "Selecciona al menos una habilidad";
    if (!chapter) newErrors.chapter = "El capítulo es requerido";
    if (!note) newErrors.note = "La descripción es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createTutoringRequest({
        tuteeId: "mocked-user-id",
        skills: selectedSkills,
        chapterId: chapter,
        note,
      });
      alert("¡Solicitud de mentoría enviada exitosamente!");
      setSelectedSkills([]);
      setChapter("");
      setNote("");
      const homeUrl = ROUTE_PATHS.HOME.getHref();
      window.location.href = homeUrl;
    } catch (err) {
      console.error(err);
      alert("Algo salió mal, por favor intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-6 w-full">
        <CardTitle className="text-2xl font-bold text-center">Solicitar Mentoría</CardTitle>
        <CardDescription className="text-center text-base mt-2">
          Completa el formulario para solicitar una sesión de mentoría.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="text-sm resize-none"
            />
            {errors.note && <p className="text-sm text-destructive">{errors.note}</p>}
          </div>

          <Button type="submit" className="w-full mt-6 h-10 text-base" disabled={loading} size="default">
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
