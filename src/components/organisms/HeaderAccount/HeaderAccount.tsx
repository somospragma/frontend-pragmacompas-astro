import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, PlayCircle } from "lucide-react";
import { useMemo, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/shared/utils/enums/paths";
import type { Account } from "@/shared/entities/account";

interface HeaderAccountProps {
  readonly account: Account;
}

/**
 * Main header for account page with animations and gradient design
 *
 * @example
 * <HeaderAccount account={accountData} />
 */
export const HeaderAccount = ({ account }: HeaderAccountProps) => {
  const { bannerColorHex, name, description } = account;

  const patternId = useId();

  const gradientStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${bannerColorHex}40 0%, ${bannerColorHex}10 100%)`,
    }),
    [bannerColorHex]
  );

  const buttonStyle = useMemo(
    () => ({
      backgroundColor: bannerColorHex,
      color: "white",
    }),
    [bannerColorHex]
  );

  const handleBack = useCallback(() => {
    history.back();
  }, []);

  return (
    <motion.header
      className="relative h-64 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      aria-labelledby="account-title"
    >
      <div className="absolute inset-0 z-0" style={gradientStyle} aria-hidden="true" />

      <div className="absolute inset-0 z-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%" aria-hidden="true">
          <pattern
            id={patternId}
            width="10"
            height="10"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="10" stroke={bannerColorHex} strokeWidth={1} />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>

      <div className="relative z-10 h-full justify-end p-6 grid grid-cols-1 gap-4 md:grid-cols-2 items-end">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Volver a la página anterior">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Volver
          </Button>

          <h1 id="account-title" className="text-4xl font-bold mt-4" style={{ color: bannerColorHex }}>
            {name}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mt-2">{description}</p>
        </motion.div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <a href={ROUTE_PATHS.TRIVIA_SCRIPT.getHref()}>
            <Button type="button" size="lg" className="group" style={buttonStyle}>
              <PlayCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Prueba tu conocimiento
              <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" aria-hidden="true" />
            </Button>
          </a>
        </motion.div>
      </div>
    </motion.header>
  );
};
