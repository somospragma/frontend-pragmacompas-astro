import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  name: string;
  description: string;
  color: string;
}

export const HeaderAccount = ({ name, description, color }: Props) => {
  return (
    <motion.header
      className="relative h-64 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{ background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)` }}
      />

      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern
            id="diagonalHatch"
            width="10"
            height="10"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="10" stroke={color} strokeWidth={1} />
          </pattern>
          <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
        </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button variant="ghost" size="sm" onClick={() => history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>

          <h1 className="text-4xl font-bold mt-4" style={{ color }}>
            {name}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mt-2">{description}</p>
        </motion.div>
      </div>
    </motion.header>
  );
};
