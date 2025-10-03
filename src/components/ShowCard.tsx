import { Clock } from "lucide-react";
import { LiveBadge } from "./LiveBadge";
import { Badge } from "./ui/badge";

interface ShowCardProps {
  title: string;
  resident: string;
  time: string;
  status: "live" | "upcoming" | "replay";
  genre?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function ShowCard({
  title,
  resident,
  time,
  status,
  genre,
  size = "md",
  onClick,
}: ShowCardProps) {
  const isClickable = !!onClick;

  const sizeClasses = {
    sm: "p-5",
    md: "p-7",
    lg: "p-9",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border rounded-3xl ${sizeClasses[size]} ${
        isClickable
          ? "cursor-pointer hover:border-accent/30 transition-all"
          : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground">{time}</span>
        {status === "live" && <LiveBadge variant="small" />}
        {status === "replay" && (
          <Badge variant="outline" className="text-xs">
            REPLAY
          </Badge>
        )}
      </div>

      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground">{resident}</p>
    </div>
  );
}
