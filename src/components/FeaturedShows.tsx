import { useEffect, useState } from "react";
import { ShowCard } from "./ShowCard";
import type { ScheduleResponse, ScheduleEvent } from "../types/api";
import axios from "axios";

export interface Show {
  id: string;
  title: string;
  resident: string;
  time: string;
  status: "live" | "upcoming" | "replay";
  genre: string;
}

interface FeaturedShowsProps {
  onShowClick: (showId: string) => void;
  timezone?: string;
}

const API_KEY = "pk_5d456436ee8d4bb3b9a88e64d457a07e";
const API_BASE = "https://api.radiocult.fm/api/station/zawyeh-radio";

async function fetchSchedule(startDate: string, endDate: string, timezone?: string) {
  const params = {
    startDate,
    endDate,
    ...(timezone ? { timezone } : {}),
  };

  const response = await axios.get<ScheduleResponse>(`${API_BASE}/schedule`, {
    params,
    headers: {
      'x-api-key': API_KEY,
    },
  });

  return response.data;
}

function formatEventToShow(event: ScheduleEvent): Show {
  const startDate = new Date(event.startDateUtc);
  const isToday = new Date().toDateString() === startDate.toDateString();
  const isTomorrow = new Date(Date.now() + 86400000).toDateString() === startDate.toDateString();
  
  const timeString = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    timeZone: event.timezone 
  });

  let timePrefix = isToday ? "Today" : isTomorrow ? "Tomorrow" : startDate.toLocaleDateString();

  return {
    id: event.id,
    title: event.title,
    resident: event.metadata?.artist || "Various Artists",
    time: `${timePrefix} ${timeString}`,
    status: new Date() > new Date(event.startDateUtc) ? "replay" : "upcoming",
    genre: "Radio Show", // Could be extracted from metadata or description if available
  };
}

export function FeaturedShows({ onShowClick, timezone = "Asia/Amman" }: FeaturedShowsProps) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError(null);
        
        // Get schedule for next 7 days
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const startDate = now.toISOString();
        const endDate = weekFromNow.toISOString();
        
        const schedule = await fetchSchedule(startDate, endDate, timezone);
        
        if (schedule.success && Array.isArray(schedule.schedules)) {
          const formattedShows = schedule.schedules.map(formatEventToShow);
          const upcomingShows = formattedShows
            .filter(show => show.status === "upcoming")
            .slice(0, 3); // Show next 3 upcoming shows
          setShows(upcomingShows);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [timezone]);

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="mb-12">Upcoming Shows</h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-8">{error}</div>
        ) : shows.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">No upcoming shows scheduled</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shows.map((show) => (
              <ShowCard
                key={show.id}
                {...show}
                onClick={() => onShowClick(show.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}