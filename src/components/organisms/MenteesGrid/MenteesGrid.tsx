import { useState } from "react";

interface Mentee {
  id: number;
  name: string;
  level: string;
  interests: string[];
  joinDate: string;
  progress: number;
  img: string;
  status: string;
}

interface Props {
  mentees: Mentee[];
}

export default function MenteesGrid({ mentees }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos los estados");

  const filteredMentees = mentees.filter((mentee) => {
    const matchesSearch =
      mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee.level.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "Todos los estados" || mentee.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Mentees</h1>
        <div className="flex gap-4">
          <input
            className="bg-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            type="text"
            placeholder="Buscar tutees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>En pausa</option>
            <option>Completado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMentees.map((mentee) => (
          <div key={mentee.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src={mentee.img} alt={mentee.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{mentee.name}</h3>
                  <p className="text-muted-foreground text-sm">{mentee.level}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  mentee.status === "Activo"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {mentee.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Intereses:</p>
                <div className="flex flex-wrap gap-1">
                  {mentee.interests.map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="text-foreground">{mentee.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${mentee.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Inicio: {new Date(mentee.joinDate).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors text-sm">
                  Ver Perfil
                </button>
                <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/80 transition-colors text-sm">
                  Programar Sesión
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMentees.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron tutees que coincidan con los filtros.</p>
        </div>
      )}
    </div>
  );
}
