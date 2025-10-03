interface LiveBadgeProps {
  variant?: "default" | "small";
}

export function LiveBadge({ variant = "default" }: LiveBadgeProps) {
  if (variant === "small") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 text-accent text-xs tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        LIVE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent tracking-wider">
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      LIVE
    </span>
  );
}
