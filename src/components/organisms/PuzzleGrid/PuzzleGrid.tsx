import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { PuzzlePiece } from "./PuzzlePiece/PuzzlePiece";
import type { Account } from "@/shared/entities/account";
import { generateShapeForIndex } from "@/shared/utils/helpers/generate-piece-shape";
import { sanitizeHexColor } from "@/shared/utils/sanitize";

interface Props {
  accounts: Account[];
}

export const PuzzleGrid = memo(({ accounts }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeColor = useMemo(
    () => sanitizeHexColor(accounts.find((a) => a.id === activeId)?.bannerColorHex ?? "#fff"),
    [accounts, activeId]
  );

  return (
    <motion.div
      role="list"
      aria-label={`Grid de cuentas con ${accounts.length} ubicaciones`}
      className="grid grid-cols-1 md:grid-cols-3 gap-10 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {accounts.map((account, index) => (
        <div role="listitem" key={account.id}>
          <PuzzlePiece
            account={account}
            isActive={activeId === account.id}
            onHover={() => setActiveId(account.id)}
            onLeave={() => setActiveId(null)}
            shape={generateShapeForIndex(index, accounts.length)}
          />
        </div>
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
                <circle cx="10" cy="10" r="1.6" fill={activeColor} />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});
