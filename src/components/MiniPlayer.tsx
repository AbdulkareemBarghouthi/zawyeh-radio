import { AudioPlayer } from "./AudioPlayer";

interface MiniPlayerProps {
  isVisible: boolean;
  isLive?: boolean;
  showTitle?: string;
  resident?: string;
}

export function MiniPlayer({
  isVisible,
  isLive = false,
  showTitle = "No Show Playing",
  resident = "",
}: MiniPlayerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <AudioPlayer
          variant="compact"
          isLive={isLive}
          showTitle={showTitle}
          resident={resident}
        />
      </div>
    </div>
  );
}
