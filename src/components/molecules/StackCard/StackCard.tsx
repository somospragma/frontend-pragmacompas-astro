interface StackCardProps {
  title: string;
  count: number;
  icon: string;
  color: string;
}

export default function StackCard({ title, count, icon, color }: StackCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-2">{title}</h3>
          <p className="text-3xl font-bold text-foreground">{count}</p>
          <p className="text-xs text-muted-foreground mt-1">desarrolladores</p>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} shadow-sm`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
