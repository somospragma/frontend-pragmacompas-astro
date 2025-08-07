import React from "react";
import { Code, Database, Globe, Smartphone } from "lucide-react";

const TechStackCards: React.FC = () => {
  const technologies = [
    {
      icon: Code,
      title: "Frontend",
      description: "React, TypeScript, Tailwind CSS",
      color: "bg-blue-500",
    },
    {
      icon: Database,
      title: "Backend",
      description: "Node.js, Express, PostgreSQL",
      color: "bg-green-500",
    },
    {
      icon: Globe,
      title: "Web",
      description: "Astro, Next.js, Vercel",
      color: "bg-purple-500",
    },
    {
      icon: Smartphone,
      title: "Mobile",
      description: "React Native, Expo",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="
            bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg
            hover:shadow-lg dark:hover:shadow-xl transition-all duration-300
            border border-gray-200 dark:border-gray-700
          "
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${tech.color} rounded-lg p-3`}>
                <tech.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{tech.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tech.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStackCards;
