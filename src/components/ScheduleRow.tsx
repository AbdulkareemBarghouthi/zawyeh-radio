import { LiveBadge } from "./LiveBadge";
import { Badge } from "./ui/badge";

interface ScheduleRowProps {
  time: string;
  title: string;
  resident: string;
  status: "live" | "upcoming" | "past";
  onClick?: () => void;
}

export function ScheduleRow({ time, title, resident, status, onClick }: ScheduleRowProps) {
  return (
    <div
      onClick={onClick}
      className={`grid grid-cols-[140px_1fr_auto] gap-8 py-7 border-b border-border last:border-0 ${
        onClick ? "cursor-pointer hover:bg-secondary/30 -mx-8 px-8 rounded-2xl transition-all" : ""
      } ${status === "past" ? "opacity-40" : ""}`}
    >
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>

      <div>
        <h4 className="mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{resident}</p>
      </div>

      <div className="flex items-center">
        {status === "live" && <LiveBadge variant="small" />}
        {status === "past" && (
          <Badge variant="outline" className="text-xs">
            REPLAY
          </Badge>
        )}
      </div>
    </div>
  );
}
