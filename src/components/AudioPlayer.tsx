import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "./ui/slider";
import { VUMeter } from "./VUMeter";

interface AudioPlayerProps {
  isLive?: boolean;
  showTitle?: string;
  resident?: string;
  variant?: "full" | "compact";
}

const STREAM_URL = "https://zawyeh-radio.radiocult.fm/stream";

export function AudioPlayer({
  isLive = false,
  showTitle = "No Show Playing",
  resident = "",
  variant = "full",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.preload = "none";

    const audio = audioRef.current;
    audio.addEventListener("playing", () => setIsLoading(false));
    audio.addEventListener("waiting", () => setIsLoading(true));
    audio.addEventListener("error", (e) => {
      setError("Error loading stream. Please try again later.");
      setIsPlaying(false);
      setIsLoading(false);
    });

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        audio.load();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setError(null);
      setIsLoading(true);
      audioRef.current.play().catch((err) => {
        setError("Error playing stream. Please try again.");
        setIsLoading(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-5 w-full">
        <button
          onClick={togglePlay}
          disabled={!!error}
          className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isLive && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs tracking-wider text-accent">LIVE</span>
              </div>
            )}
            <h4 className="truncate">{showTitle}</h4>
          </div>
          {resident && (
            <p className="text-sm text-muted-foreground truncate">{resident}</p>
          )}
          {error && <p className="text-xs text-destructive mt-1 truncate">{error}</p>}
        </div>

        <div className="flex items-center gap-4">
          {isPlaying && isLive && !isLoading && <VUMeter />}
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div className="w-24">
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-10">
      <div>
        <button
          onClick={togglePlay}
          disabled={!!error}
          className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          {isLive && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-sm tracking-wider text-accent">LIVE</span>
            </div>
          )}
          <h2 className="mb-2">{showTitle}</h2>
          {resident && <p className="text-muted-foreground">{resident}</p>}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
        {isPlaying && isLive && !isLoading && <VUMeter />}
      </div>
    </div>
  );
}
