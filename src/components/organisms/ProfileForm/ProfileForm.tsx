import { Avatar } from "@/components/ui/avatar";
import { SENIORITY_OPTIONS } from "@/shared/utils/enums/seniority";
import { Label } from "@/components/ui/label";
import { getChapters } from "@/infrastructure/services/getChapters";
import { postCreateUser } from "@/infrastructure/services/postCreateUser";
import { updateUser } from "@/infrastructure/services/updateUser";
import { updateUserProfile, userStore } from "@/store/userStore";
import { useStore } from "@nanostores/react";
import { Mail } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/shared/utils/enums/role";
import { sanitizeText } from "@/shared/utils/inputValidation";

/**
 * Valida formato de email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * ProfileForm Component
 *
 * Formulario de edición de perfil que permite a los usuarios actualizar su chapter y seniority.
 * Incluye validación, sanitización y optimizaciones de performance.
 *
 * @component
 */
export const ProfileForm = memo(function ProfileForm() {
  const user = useStore(userStore);
  const isMountedRef = useRef(true);
  const lastSubmitTimeRef = useRef<number>(0);

  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);

  const [formData, setFormData] = useState({
    chapterId: user.chapterId || "",
    seniority: user.seniority ? String(user.seniority) : "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [initialValidationShown, setInitialValidationShown] = useState(false);

  // Sanitizar datos del usuario (Seguridad: XSS Prevention)
  const sanitizedUser = useMemo(
    () => ({
      firstName: sanitizeText(user?.firstName),
      email: user?.email && isValidEmail(user.email) ? user.email : "",
      userId: user?.userId || "",
      googleId: user?.googleId || "",
      lastName: user?.lastName || "",
    }),
    [user?.firstName, user?.email, user?.userId, user?.googleId, user?.lastName]
  );

  // Memoizar búsqueda de chapter seleccionado (Performance)
  const selectedChapter = useMemo(
    () => chapters.find((c) => c.id === formData.chapterId),
    [chapters, formData.chapterId]
  );

  // Memoizar búsqueda de seniority seleccionada (Performance)
  const selectedSeniority = useMemo(
    () => SENIORITY_OPTIONS.find((c) => c.value === formData.seniority),
    [formData.seniority]
  );

  // Validación inicial
  useEffect(() => {
    if (!initialValidationShown && user.id) {
      const initialErrors: { [key: string]: string } = {};
      if (!user.chapterId) initialErrors.chapterId = "El chapter es requerido";
      if (!user.seniority) initialErrors.seniority = "La seniority es requerida";
      setErrors(initialErrors);
      setInitialValidationShown(true);
    }
  }, [user.id, user.chapterId, user.seniority, initialValidationShown]);

  // Cargar chapters con cleanup (Performance: Memory Leak Prevention)
  useEffect(() => {
    isMountedRef.current = true;
    setIsLoadingChapters(true);

    getChapters()
      .then((res) => {
        if (isMountedRef.current) {
          setChapters(res as { id: string; name: string }[]);
        }
      })
      .catch((error) => {
        if (isMountedRef.current) {
          console.error("[ProfileForm] Failed to load chapters:", error);
          toast.error("Error al cargar chapters", {
            description: "No se pudieron cargar los chapters. Recarga la página.",
          });
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsLoadingChapters(false);
        }
      });

    return () => {
      isMountedRef.current = false;
    };
  }, [user.id]);

  // Sincronizar formData con cambios en user
  useEffect(() => {
    setFormData({
      chapterId: user.chapterId || "",
      seniority: user.seniority ? String(user.seniority) : "",
    });
  }, [user.chapterId, user.seniority]);

  // Función de validación memoizada (Performance)
  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!formData.chapterId) newErrors.chapterId = "El chapter es requerido";
    if (!formData.seniority) newErrors.seniority = "La seniority es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.chapterId, formData.seniority]);

  // Función para crear usuario memoizada con sanitización (Performance + Seguridad)
  const createUser = useCallback(async () => {
    if (!user) {
      console.warn("[ProfileForm] createUser called without user");
      return;
    }

    try {
      console.info("[ProfileForm] Creating new user", { email: sanitizedUser.email });

      await postCreateUser({
        firstName: sanitizeText(user.firstName),
        lastName: sanitizeText(user.lastName),
        email: sanitizedUser.email,
        googleUserId: sanitizedUser.googleId,
        chapterId: formData.chapterId.trim(),
        seniority: formData.seniority.trim(),
        rol: UserRole.TUTEE,
      });

      console.info("[ProfileForm] User created successfully");

      toast.success("¡Usuario creado exitosamente!", {
        description: "Tu perfil ha sido creado correctamente.",
        duration: 4000,
      });
    } catch (error) {
      console.error("[ProfileForm] Failed to create user:", error);
      toast.error("Error al crear usuario", {
        description: "No se pudo crear tu perfil. Intenta nuevamente.",
        duration: 4000,
      });
      throw error;
    }
  }, [user, sanitizedUser, formData.chapterId, formData.seniority]);

  // Función de submit memoizada con rate limiting y prevención de race conditions (Performance + Seguridad)
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Rate limiting: Prevenir múltiples submits en 2 segundos (Seguridad)
      const now = Date.now();
      if (now - lastSubmitTimeRef.current < 2000) {
        console.warn("[ProfileForm] Rate limit: Submit too fast");
        toast.warning("Por favor espera un momento antes de guardar nuevamente", {
          duration: 2000,
        });
        return;
      }
      lastSubmitTimeRef.current = now;

      console.info("[ProfileForm] Submit initiated", {
        userId: sanitizedUser.userId,
        hasChapterId: !!formData.chapterId,
        hasSeniority: !!formData.seniority,
      });

      if (!validate()) {
        console.warn("[ProfileForm] Validation failed", { errors });
        return;
      }

      // Prevenir múltiples submits simultáneos (Seguridad: Race Condition Prevention)
      if (isSubmitting) {
        console.warn("[ProfileForm] Submit already in progress");
        return;
      }

      // Capturar estado actual para prevenir race conditions (Seguridad)
      const currentUserId = sanitizedUser.userId;

      setIsSubmitting(true);

      try {
        // Validación de seguridad antes de enviar
        if (!formData.chapterId.trim() || !formData.seniority.trim()) {
          throw new Error("Datos inválidos");
        }

        if (currentUserId === "") {
          await createUser();
        } else {
          console.info("[ProfileForm] Updating existing user", { userId: currentUserId });

          await updateUser({
            id: currentUserId,
            chapterId: formData.chapterId.trim(),
            seniority: formData.seniority.trim(),
          });

          updateUserProfile({
            chapterId: formData.chapterId.trim(),
            seniority: formData.seniority.trim(),
          });

          console.info("[ProfileForm] User updated successfully");
        }

        // Limpiar errores después de actualización exitosa
        setErrors({});

        toast.success("¡Perfil actualizado exitosamente!", {
          description: "Tus datos han sido guardados correctamente.",
          duration: 4000,
        });
      } catch (err) {
        console.error("[ProfileForm] Submit failed:", err);

        const errorMessage = err instanceof Error ? err.message : "Error desconocido";

        toast.error("Error al actualizar perfil", {
          description: errorMessage.includes("network")
            ? "Error de conexión. Verifica tu internet."
            : "Algo salió mal, por favor intenta de nuevo más tarde.",
          duration: 4000,
        });
      } finally {
        setIsSubmitting(false);
        console.info("[ProfileForm] Submit completed");
      }
    },
    [validate, isSubmitting, sanitizedUser, formData, createUser, errors]
  );

  // Función para obtener iniciales memoizada (Performance)
  const getInitials = useCallback((name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <div className="space-y-8 mt-8">
      {/* Profile Section */}
      <div className="w-full">
        {/* Profile Info - Horizontal Layout */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b">
          <Avatar
            src={sanitizedUser.email || undefined}
            alt={getInitials(sanitizedUser.firstName)}
            fallback={getInitials(sanitizedUser.firstName)}
            size="xl"
            className="ring-2 ring-border"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{sanitizedUser.firstName || "Usuario"}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{sanitizedUser.email || "email@ejemplo.com"}</span>
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
              {isLoadingChapters ? (
                <div className="max-w-md h-10 bg-muted animate-pulse rounded-md" />
              ) : (
                <div className="max-w-md p-2 border rounded-md">
                  <p>{selectedChapter?.name || "Sin información disponible"}</p>
                </div>
              )}
              {errors.chapterId && <p className="text-sm text-destructive">{errors.chapterId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seniority" className="text-sm font-medium text-foreground">
                Seniority <span className="text-destructive">*</span>
              </Label>
              <div className="max-w-md p-2 border rounded-md">
                <p>{selectedSeniority?.label || "Sin información disponible"}</p>
              </div>
              {errors.seniority && <p className="text-sm text-destructive">{errors.seniority}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});
