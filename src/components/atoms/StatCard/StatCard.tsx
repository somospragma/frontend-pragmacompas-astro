interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  subtitle?: string;
  subtitleColor?: string;
  onClick?: () => void;
}

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
  const baseClasses = "bg-card border border-border rounded-lg p-6";
  const interactiveClasses = onClick ? "cursor-pointer hover:bg-card/80 transition-colors duration-200" : "";

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      {subtitle && <div className={`mt-2 text-xs ${subtitleColor || "text-muted-foreground"}`}>{subtitle}</div>}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={`${baseClasses} ${interactiveClasses} w-full text-left`} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
