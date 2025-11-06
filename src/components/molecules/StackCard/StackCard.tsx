import { useCallback } from "react";
import { sanitizeText, sanitizeNumber } from "@/shared/utils/inputValidation";
import { t } from "@/shared/i18n/translations";

interface StackCardProps {
  title: string;
  count: number;
  icon: string;
  color: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export default function StackCard({
  title,
  count,
  icon,
  color,
  onClick,
  href,
  disabled = false,
  className = "",
}: StackCardProps) {
  const sanitizedTitle = sanitizeText(title);
  const sanitizedCount = sanitizeNumber(count);
  const isInteractive = !!(onClick || href);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (href) {
        // Let the browser handle the navigation
        return;
      }

      if (onClick) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick, href, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        if (href) {
          window.location.href = href;
        } else if (onClick) {
          onClick();
        }
      }
    },
    [onClick, href, disabled]
  );

  const baseClasses = `
    bg-card rounded-xl p-6 shadow-sm border border-border 
    transition-all duration-200 
    ${isInteractive ? "hover:shadow-lg hover:scale-105 cursor-pointer" : ""}
    ${isInteractive ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `.trim();

  const developersText = t("common.developers");
  const ariaLabel = `${sanitizedTitle}: ${sanitizedCount} ${developersText}`;

  if (isInteractive) {
    const Component = href ? "a" : "button";

    return (
      <Component
        className={baseClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        href={href}
        role={href ? "link" : "button"}
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-disabled={disabled}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium mb-2">{sanitizedTitle}</h3>
            <p className="text-3xl font-bold text-foreground" aria-hidden="true">
              {sanitizedCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1" aria-hidden="true">
              {developersText}
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} shadow-sm`}
            aria-hidden="true"
          >
            <span className="text-2xl" role="img" aria-label={`${sanitizedTitle} ${t("accessibility.icon")}`}>
              {icon}
            </span>
          </div>
        </div>
      </Component>
    );
  }

  // Non-interactive version
  return (
    <div className={baseClasses} role="region" aria-label={ariaLabel}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-2">{sanitizedTitle}</h3>
          <p className="text-3xl font-bold text-foreground">{sanitizedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">{developersText}</p>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} shadow-sm`} aria-hidden="true">
          <span className="text-2xl" role="img" aria-label={`${sanitizedTitle} ${t("accessibility.icon")}`}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
