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
      className={`
        relative overflow-hidden
        ${sizeClasses[size]}
        rounded-3xl
        border border-white/20
        bg-white/8 dark:bg-white/5
        backdrop-blur-xl backdrop-saturate-150
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]
        transition-all duration-300
        ${isClickable ? "cursor-pointer hover:bg-white/15 hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)]" : ""}
      `}
    >
      {/* top reflection gradient */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0)_40%)]" />

      {/* fine noise texture */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay opacity-100 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.03'/></svg>")`,
        }}
      />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <span className="text-base font-medium text-white/80">{time}</span>

        {status === "live" && <LiveBadge variant="small" />}
        {status === "replay" && (
          <Badge
            variant="outline"
            className="text-sm border-white/30 text-white/90 font-medium"
          >
            REPLAY
          </Badge>
        )}
      </div>

      <h3 className="mb-3 text-xl md:text-2xl text-white font-bold tracking-tight relative z-10">
        {title}
      </h3>
      <p className="text-lg text-white/80 font-medium relative z-10">{resident}</p>

      {genre && (
        <p className="mt-4 text-sm uppercase tracking-wider text-white/60 font-medium relative z-10">
          {genre}
        </p>
      )}
    </div>
  );
}
