import { useMemo } from "react";

interface SectionHeaderProps {
  readonly description: string;
  readonly className?: string;
}

/**
 * SectionHeader component displays a descriptive text header for page sections
 * @param description - The text content to display
 * @param className - Optional additional CSS classes
 */
export default function SectionHeader({ description, className = "" }: SectionHeaderProps) {
  const combinedClassName = useMemo(() => `-mb-8 ${className}`.trim(), [className]);

  return (
    <header className={combinedClassName} role="heading" aria-level={2}>
      <p className="text-muted-foreground">{description}</p>
    </header>
  );
}
