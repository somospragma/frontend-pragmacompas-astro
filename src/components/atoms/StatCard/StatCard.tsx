import { useMemo, useCallback } from "react";

interface StatCardProps {
  readonly value: number;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly iconBgColor: string;
  readonly iconColor: string;
  readonly subtitle?: string;
  readonly subtitleColor?: string;
  readonly onClick?: () => void;
}

/**
 * StatCard component displays statistical information with an icon
 * @param value - Numeric value to display
 * @param label - Descriptive label for the statistic
 * @param icon - Icon element to display
 * @param iconBgColor - Background color class for icon container
 * @param iconColor - Text/icon color class
 * @param subtitle - Optional subtitle text
 * @param subtitleColor - Optional subtitle color class
 * @param onClick - Optional click handler (makes card interactive)
 */
export default function StatCard({
  value,
  label,
  icon,
  iconBgColor,
  iconColor,
  subtitle,
  subtitleColor,
  onClick,
}: StatCardProps) {
  const baseClasses = useMemo(() => "bg-card border border-border rounded-lg p-6", []);

  const interactiveClasses = useMemo(
    () => (onClick ? "cursor-pointer hover:bg-card/80 transition-colors duration-200" : ""),
    [onClick]
  );

  const containerClasses = useMemo(
    () => `${baseClasses} ${interactiveClasses}`.trim(),
    [baseClasses, interactiveClasses]
  );

  const iconContainerClasses = useMemo(
    () => `w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`,
    [iconBgColor]
  );

  const subtitleClasses = useMemo(() => `mt-2 text-xs ${subtitleColor || "text-muted-foreground"}`, [subtitleColor]);

  // Memoize aria-label for button variant
  const ariaLabel = useMemo(() => {
    const subtitleText = subtitle ? `, ${subtitle}` : "";
    return `${label}: ${value}${subtitleText}`;
  }, [label, value, subtitle]);

  // Memoize click handler to prevent recreating function on every render
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground" aria-live="polite">
            {value}
          </p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
        <div className={iconContainerClasses} aria-hidden="true">
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      {subtitle && (
        <div className={subtitleClasses} role="note">
          {subtitle}
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={`${containerClasses} w-full text-left`}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={containerClasses} role="region" aria-label={label}>
      {content}
    </div>
  );
}
