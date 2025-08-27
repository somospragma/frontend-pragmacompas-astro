import { useStore } from "@nanostores/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { userStore } from "@/store/userStore";

export default function ProfileAlert() {
  const user = useStore(userStore);

  const shouldShowAlert = user.isLoggedIn && (!user.chapterId || !user.seniority);

  if (!shouldShowAlert) return null;

  return (
    <div className="w-full px-4 pt-4 h-14">
      <Alert
        variant="warning"
        className="border-yellow-400/50 bg-yellow-50 dark:bg-yellow-600/20 flex items-center gap-3"
      >
        <span className="flex items-start justify-start h-full">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <AlertDescription className="font-medium w-full text-center">
          Actualiza tus datos para poder acceder a las funcionalidades
        </AlertDescription>
      </Alert>
    </div>
  );
}
