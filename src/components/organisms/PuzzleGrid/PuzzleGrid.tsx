import { useState } from "react";
import { motion } from "framer-motion";
import { PuzzlePiece } from "./PuzzlePiece/PuzzlePiece";
import type { Account } from "@/shared/entities/account";

interface Props {
  accounts: Account[];
}

export const PuzzleGrid = ({ accounts }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-10 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {accounts.map((account) => (
        <PuzzlePiece
          key={account.id}
          account={account}
          isActive={activeId === account.id}
          onHover={() => setActiveId(account.id)}
          onLeave={() => setActiveId(null)}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none">
        {activeId && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle
                  cx="10"
                  cy="10"
                  r="1.6"
                  fill={accounts.find((a) => a.id === activeId)?.bannerColorHex ?? "#fff"}
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
