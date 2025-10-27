interface SectionHeaderProps {
  description: string;
  className?: string;
}

export default function SectionHeader({ description, className = "" }: SectionHeaderProps) {
  return (
    <div className={`-mb-8 ${className}`}>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
