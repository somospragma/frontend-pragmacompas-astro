import { RoleRedirect } from "@/components/auth/RoleRedirect";
import DashboardStats from "@/components/organisms/DashboardStats/DashboardStats";
import { useEffect } from "react";
import { getDashboardStatistics } from "@/infrastructure/services/getDashboardStatistics";

interface Props {
  userName?: string;
  googleUserId?: string;
  chapterId?: string;
}

export default function AdminDashboard({ userName, googleUserId, chapterId }: Props) {
  useEffect(() => {
    console.log("AdminDashboard mounted");
    const getStats = async () => {
      if (chapterId) {
        const stats = await getDashboardStatistics({ chapterId });
        console.log("Stats:", stats);
      }
    };
    getStats();
    return () => {
      console.log("AdminDashboard unmounted");
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard del Administrador</h1>
          <p className="text-gray-600">Panel de control administrativo - {userName}</p>
        </div>

        {/* Role Redirect Component */}
        {googleUserId && <RoleRedirect googleUserId={googleUserId}>{null}</RoleRedirect>}

        {/* Dashboard Stats */}
        {chapterId && <DashboardStats chapterId={chapterId} />}

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Usuarios</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-left">
                👥 Ver Todos los Usuarios
              </button>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-left">
                ➕ Crear Usuario
              </button>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-left">
                🔄 Cambiar Roles
              </button>
            </div>
          </div>

          {/* Content Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Contenido</h2>
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-left">
                🎯 Gestionar Habilidades
              </button>
              <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-left">
                🏢 Gestionar Capítulos
              </button>
              <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-left">
                📊 Reportes y Estadísticas
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Nueva solicitud de tutoría en JavaScript</span>
              <span className="text-sm text-gray-500">Hace 2 horas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Usuario María García completó tutoría</span>
              <span className="text-sm text-gray-500">Hace 4 horas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Nuevo capítulo creado: Barranquilla</span>
              <span className="text-sm text-gray-500">Hace 1 día</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
