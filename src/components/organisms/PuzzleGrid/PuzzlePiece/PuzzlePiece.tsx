import type { Account } from "@/shared/entities/account";
import { ROUTE_PATHS } from "@/shared/utils/enums/paths";
import { hexToRgba } from "@/shared/utils/helpers/hextToRgba";
import { sanitizeHexColor, sanitizeInput } from "@/shared/utils/sanitize";
import { motion } from "framer-motion";
import { Brain, Globe, User } from "lucide-react";

interface Props {
  account: Account;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  shape: {
    hasTopTab: boolean;
    hasRightTab: boolean;
    hasBottomTab: boolean;
    hasLeftTab: boolean;
  };
}

export const PuzzlePiece = ({ account, isActive, onHover, onLeave, shape }: Props) => {
  const { hasTopTab, hasBottomTab, hasLeftTab, hasRightTab } = shape;

  // Sanitize inputs to prevent XSS attacks
  const safeColor = sanitizeHexColor(account.bannerColorHex);
  const safeName = sanitizeInput(account.name);
  const safeIaTools = account.iaTools.map((tool) => sanitizeInput(tool)).filter((tool) => tool.length > 0);

  return (
    <a
      href={ROUTE_PATHS.WORLD_PRAGMA_ACCOUNT.getHref({ id: account.id })}
      aria-label={`Ver detalles de ${safeName} - ${account.totalFrontedsDevs} desarrolladores frontend`}
      onFocus={onHover}
      onBlur={onLeave}
    >
      <div className="relative aspect-[4/3]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 240 180"
          className="absolute inset-0 cursor-pointer"
          role="img"
          aria-label={`Pieza de puzzle para ${safeName}`}
          style={{ filter: isActive ? `drop-shadow(0 0 8px ${safeColor})` : "none" }}
        >
          <motion.path
            d={`M 40,0
            ${hasTopTab ? "L 100,0 L 120,15 C 130,25 150,25 160,15 L 180,0" : "L 100,0 L 100,15 C 100,35 140,35 140,15 L 140,0"}
            L 200,0
            ${hasRightTab ? "L 240,40 L 225,60 C 215,70 215,90 225,100 L 240,120" : "L 240,40 L 225,40 C 205,40 205,80 225,80 L 240,80"}
            L 240,140
            ${hasBottomTab ? "L 200,180 L 180,165 C 170,155 150,155 140,165 L 120,180" : "L 200,180 L 200,165 C 200,145 160,145 160,165 L 160,180"}
            L 40,180
            ${hasLeftTab ? "L 0,140 L 15,120 C 25,110 25,90 15,80 L 0,60" : "L 0,140 L 15,140 C 35,140 35,100 15,100 L 0,100"}
            L 0,40 Z`}
            fill={isActive ? hexToRgba(safeColor, 0.9) : `rgba(26, 26, 46, 0.8)`}
            stroke={safeColor}
            strokeWidth={isActive ? 2 : 0}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        </svg>

        <motion.div
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          initial="initial"
          animate={isActive ? "hover" : "initial"}
          whileHover="hover"
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          variants={{
            initial: { scale: 1 },
            hover: {
              scale: 1.05,
              transition: { type: "spring", stiffness: 300, damping: 15 },
            },
          }}
        >
          <motion.div
            className="absolute inset-0 z-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                ${safeColor}20 10px,
                ${safeColor}20 20px
              )`,
            }}
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 0.3, transition: { duration: 1.5 } },
            }}
          />

          <motion.div
            className="z-10 text-center px-4 max-w-[200px]"
            variants={{
              initial: { y: 0, opacity: 1 },
              hover: { y: -5, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 20 } },
            }}
          >
            <motion.span
              className="text-xl font-bold block"
              variants={{
                initial: { color: safeColor, textShadow: "none" },
                hover: { color: "#fff", textShadow: `0 0 8px ${safeColor}` },
              }}
            >
              {safeName}
            </motion.span>

            <motion.ul
              className="space-y-2 text-sm text-white list-none opacity-0 pointer-events-none "
              variants={{
                initial: {
                  opacity: 0,
                  marginTop: "0",
                  pointerEvents: "none",
                  height: "0px",
                  overflow: "hidden",
                },
                hover: {
                  opacity: 1,
                  marginTop: "0.4rem",
                  pointerEvents: "auto",
                  transition: { delay: 0.1 },
                  height: "auto",
                },
              }}
            >
              <li className="flex items-center justify-start gap-2 opacity-80">
                <Brain className="w-4 h-4 min-w-4" />{" "}
                <span className="text-start">IA tools: {safeIaTools.join(", ")}</span>
              </li>
              <li className="flex items-center justify-start  gap-2 opacity-80">
                <User className="w-4 h-4 min-w-4" />{" "}
                <span className="text-start">Fronteños: {account.totalFrontedsDevs}</span>
              </li>
              <li className="flex items-center justify-start  gap-2 opacity-80">
                <Globe className="w-4 h-4 min-w-4" /> <span className="text-start">País: ???</span>
              </li>
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>
    </a>
  );
};
