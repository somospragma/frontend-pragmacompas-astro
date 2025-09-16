import { useState } from "react";

interface Mentor {
  id: number;
  name: string;
  role: string;
  skills: string[];
  experience: string;
  rating: number;
  sessions: number;
  img: string;
  available: boolean;
}

interface Props {
  mentores: Mentor[];
}

export default function MentoresGrid({ mentores }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas las especialidades");

  const filteredMentores = mentores.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "Todas las especialidades" ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Tutores</h1>
        <div className="flex gap-4">
          <input
            className="bg-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            type="text"
            placeholder="Buscar tutores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option>Todas las especialidades</option>
            <option>React</option>
            <option>Node.js</option>
            <option>Python</option>
            <option>DevOps</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentores.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={mentor.img} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{mentor.name}</h3>
                <p className="text-muted-foreground text-sm">{mentor.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${mentor.available ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className="text-xs text-muted-foreground">{mentor.available ? "Disponible" : "Ocupado"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {mentor.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                    {skill}
                  </span>
                ))}
                {mentor.skills.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                    +{mentor.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>⭐ {mentor.rating}</span>
                <span>{mentor.sessions} sesiones</span>
                <span>{mentor.experience}</span>
              </div>

              <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
                Solicitar Tutoría
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentores.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron tutores que coincidan con los filtros.</p>
        </div>
      )}
    </div>
  );
}
