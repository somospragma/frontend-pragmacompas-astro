import type { GetMyRequests } from "@/infrastructure/services/getMyRequests";

export const mockGetMyRequestsResponse: GetMyRequests = {
  message: "Solicitudes y tutorías obtenidas exitosamente",
  timestamp: "2025-08-23T10:30:00Z",
  data: {
    requests: [
      {
        id: "req-001",
        tutee: {
          id: "user-123",
          firstName: "Carlos",
          lastName: "Mendoza",
          email: "carlos.mendoza@pragma.com.co",
          chapter: {
            id: "chapter-front",
            name: "Frontend",
          },
          rol: "Tutorado",
          activeTutoringLimit: 2,
        },
        skills: [
          {
            id: "skill-react",
            name: "React",
            categories: [{ id: "cat-frontend" }],
          },
          {
            id: "skill-hooks",
            name: "React Hooks",
            categories: [{ id: "cat-frontend" }],
          },
        ],
        needsDescription: "Necesito ayuda para entender useState y useEffect en proyectos reales",
        requestStatus: "Enviada",
      },
      {
        id: "req-002",
        tutee: {
          id: "user-123",
          firstName: "Juan",
          lastName: "Pino",
          email: "juan.pino@pragma.com.co",
          chapter: {
            id: "chapter-back",
            name: "Backend",
          },
          rol: "Tutorado",
          activeTutoringLimit: 2,
        },
        skills: [
          {
            id: "skill-sql",
            name: "SQL",
            categories: [{ id: "cat-database" }],
          },
        ],
        needsDescription: "Quiero mejorar el rendimiento de mis consultas en PostgreSQL",
        requestStatus: "Aprobada",
      },
      {
        id: "req-003",
        tutee: {
          id: "user-123",
          firstName: "Jhon",
          lastName: "Hernandez",
          email: "jhon.hernandez@pragma.com.co",
          chapter: {
            id: "chapter-architecture",
            name: "Arquitectura",
          },
          rol: "Tutorado",
          activeTutoringLimit: 2,
        },
        skills: [
          {
            id: "skill-architecture",
            name: "Clean Architecture",
            categories: [{ id: "cat-backend" }],
          },
        ],
        needsDescription: "Implementar Clean Architecture en un proyecto Node.js con TypeScript",
        requestStatus: "Rechazada",
      },
    ],
    tutoringsAsTutor: [
      {
        id: "tutor-001",
        tutor: {
          id: "user-123",
          firstName: "Carlos",
          lastName: "Mendoza",
          email: "carlos.mendoza@pragma.com.co",
          chapter: {
            id: "chapter-bog",
            name: "Bogotá",
          },
          rol: "Tutor",
          activeTutoringLimit: 3,
        },
        tutee: {
          id: "user-456",
          firstName: "Ana",
          lastName: "García",
          email: "ana.garcia@pragma.com.co",
          chapter: {
            id: "chapter-med",
            name: "Medellín",
          },
          rol: "Tutorado",
          activeTutoringLimit: 2,
        },
        skills: [
          {
            id: "skill-react",
            name: "React",
            categories: [{ id: "cat-frontend" }],
          },
        ],
        startDate: "2025-08-25T15:00:00Z",
        expectedEndDate: "2025-08-25T16:30:00Z",
        status: "Aprobada",
        objectives: "Tutoría práctica sobre manejo de estado con hooks",
      },
    ],
    tutoringsAsTutee: [
      {
        id: "tutee-001",
        tutor: {
          id: "user-789",
          firstName: "Luis",
          lastName: "Rodríguez",
          email: "luis.rodriguez@pragma.com.co",
          chapter: {
            id: "chapter-bog",
            name: "Bogotá",
          },
          rol: "Tutor",
          activeTutoringLimit: 5,
        },
        tutee: {
          id: "user-123",
          firstName: "Carlos",
          lastName: "Mendoza",
          email: "carlos.mendoza@pragma.com.co",
          chapter: {
            id: "chapter-bog",
            name: "Bogotá",
          },
          rol: "Tutorado",
          activeTutoringLimit: 2,
        },
        skills: [
          {
            id: "skill-docker",
            name: "Docker",
            categories: [{ id: "cat-devops" }],
          },
        ],
        startDate: "2025-08-22T10:00:00Z",
        expectedEndDate: "2025-08-22T11:30:00Z",
        status: "Asignada",
        objectives: "Introducción a contenedores y despliegue con Docker",
      },
    ],
  },
};
