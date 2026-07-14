import { Clock } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  onClick?: () => void;
}

export function EventCard({ title, date, time, onClick }: EventCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 min-w-0 p-3 rounded-md text-left transition-colors hover:bg-muted/50"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Date — slightly larger and emphasized */}
      <p className="text-sm font-semibold text-foreground mb-1">{date}</p>

      {/* Title */}
      <p className="text-sm font-medium text-foreground truncate mb-2">{title}</p>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3 shrink-0" />
        <span>{time}</span>
      </div>
    </button>
  );
}
