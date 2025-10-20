import Modal from "@/components/molecules/Modal/Modal";
import { validateUser } from "@/infrastructure/services/validateUser";
import { setUser, type User } from "@/store/userStore";
import { useEffect, useState } from "react";

export function UserInitializer({ user }: { user: Partial<User> | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    async function initializeUser() {
      const userValidation = await validateUser(user?.id ?? "");
      if (user && userValidation && typeof userValidation === "object" && "data" in userValidation) {
        if (userValidation.data.chapter === undefined) {
          setIsModalOpen(true);
        }
        setUser({
          ...user,
          rol: userValidation.data.rol,
          userId: userValidation.data.id,
          seniority: userValidation.data.seniority,
          chapterId: userValidation.data.chapter?.id,
        });
      }
    }
    initializeUser();
  }, []);

  return (
    <Modal
      isOpen={isModalOpen}
      children={
        <div className="text-center space-y-4 p-6 text-card-foreground">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Acceso Restringido</h3>
          <p className="text-foreground/80">
            Tu cuenta no tiene un <strong className="text-foreground">chapter asignado</strong>, lo cual es necesario
            para acceder a la plataforma de mentorías.
          </p>
          <p className="text-foreground/80">
            Por favor, contacta a un <strong className="text-foreground">administrador</strong> para que configure tu
            chapter y puedas continuar utilizando el sistema.
          </p>

          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md 
                         hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 
                         focus:ring-ring focus:ring-offset-2"
              onClick={() => {
                window.open(`https://somos-pragma.slack.com/team/U08STG5DQQ3`, "_blank");
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contactar Administrador
            </button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Mientras tanto, no podrás acceder a las funcionalidades de mentoría.</p>
          </div>
        </div>
      }
    />
  );
}
