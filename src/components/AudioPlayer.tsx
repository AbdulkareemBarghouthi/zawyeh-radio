import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "./ui/slider";
import { VUMeter } from "./VUMeter";
import axios from "axios";
import type { CurrentShowResponse } from "../types/api";

interface AudioPlayerProps {
  variant?: "full" | "compact";
  isLive?: boolean;
  showTitle?: string;
  resident?: string;
}

const STREAM_URL = "https://zawyeh-radio.radiocult.fm/stream";
const API_KEY = "pk_5d456436ee8d4bb3b9a88e64d457a07e";
const API_BASE = "https://api.radiocult.fm/api/station/zawyeh-radio";

export function AudioPlayer({ variant = "full", isLive = false, showTitle, resident }: AudioPlayerProps) {
  const defaultShow = showTitle && resident ? {
    status: "success",
    content: {
      title: showTitle,
      duration: 0,
      timezone: "",
      media: { type: "", playlistId: "" },
      entity: resident,
      doRecord: false,
      exceptions: null,
      isRecurring: false,
      created: "",
      modified: "",
      endDateUtc: "",
      startDateUtc: "",
      id: "",
      stationId: "",
      originalId: "",
      start: "",
      end: "",
      scheduleRangeStartUtc: "",
      scheduleRangeEndUtc: ""
    },
    metadata: {
      title: "",
      artist: "",
      duration: 0,
      artwork: {},
      playoutStartIsoTimestamp: ""
    }
  } : null;

  const [currentShow, setCurrentShow] = useState<CurrentShowResponse["result"] | null>(defaultShow);
  const [isLiveState, setIsLiveState] = useState(isLive);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentShow = async () => {
      try {
        const { data } = await axios.get<CurrentShowResponse>(
          `${API_BASE}/schedule/live`,
          {
            headers: {
              "x-api-key": API_KEY,
            },
          }
        );
        setCurrentShow(data.result);

        // Check if there's a current show and it's within the time range
        const now = new Date();
        const startDate = new Date(data.result.content.startDateUtc);
        const endDate = new Date(data.result.content.endDateUtc);
        setIsLiveState(now >= startDate && now <= endDate);
      } catch (error) {
        console.error("Error fetching current show:", error);
      }
    };

    fetchCurrentShow();
    const interval = setInterval(fetchCurrentShow, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
          className="w-12 h-12 text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed relative"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
  
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin relative z-10" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 relative z-10" />
          ) : (
            <Play className="w-5 h-5 ml-0.5 relative z-10" />
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
            <h4 className="truncate">
              {currentShow?.content.title || "No Show Playing"}
            </h4>
          </div>
          {currentShow?.metadata?.artist && (
            <p className="text-sm text-muted-foreground truncate">
              {currentShow.metadata.artist}
            </p>
          )}
          {error && (
            <p className="text-xs text-destructive mt-1 truncate">{error}</p>
          )}
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
          className="w-16 h-16 bg-contain bg-no-repeat bg-center text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin relative z-10" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6 relative z-10" />
          ) : (
            <Play className="w-6 h-6 ml-0.5 relative z-10" />
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
          <h2 className="mb-2">
            {currentShow?.content.title || "No Show Playing"}
          </h2>
          {currentShow?.metadata?.artist && (
            <p className="text-muted-foreground">
              {currentShow.metadata.artist}
            </p>
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
        {isPlaying && isLive && !isLoading && <VUMeter />}
      </div>
    </div>
  );
}
