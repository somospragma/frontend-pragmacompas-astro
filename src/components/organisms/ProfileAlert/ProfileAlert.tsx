import { useStore } from "@nanostores/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { userStore } from "@/store/userStore";

export default function ProfileAlert() {
  const user = useStore(userStore);

  const shouldShowAlert = user.isLoggedIn && (!user.chapterId || !user.seniority);

  if (!shouldShowAlert) return null;

  return (
    <div className="w-full max-w-7xl px-4 pt-4 h-14">
      <Alert variant="warning" className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          Actualiza tus datos para poder acceder a las funcionalidades
        </AlertDescription>
      </Alert>
    </div>
  );
}
