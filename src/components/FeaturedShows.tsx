import { useEffect, useState } from "react";
import { ShowCard } from "./ShowCard";
import type { ScheduleResponse, ScheduleEvent } from "../types/api";
import type { Artist, ArtistsResponse } from "../types/artist";
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

async function fetchArtists() {
  try {
    const { data } = await axios.get<ArtistsResponse>(`${API_BASE}/artists`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    return data.artists;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch artists"
      );
    }
    throw error;
  }
}

function formatEventToShow(event: ScheduleEvent, artists: Artist[]): Show {
  const startDate = new Date(event.startDateUtc);
  const isToday = new Date().toDateString() === startDate.toDateString();
  const isTomorrow = new Date(Date.now() + 86400000).toDateString() === startDate.toDateString();
  
  const timeString = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    timeZone: event.timezone 
  });

  let timePrefix = isToday ? "Today" : isTomorrow ? "Tomorrow" : startDate.toLocaleDateString();

  // Map artistIds to artist names
  let resident = "Various Artists";
  if (event.artistIds && event.artistIds.length > 0) {
    const artistNames = event.artistIds
      .map(artistId => {
        const artist = artists.find(a => a.id === artistId);
        return artist ? artist.name : null;
      })
      .filter(Boolean); // Remove null values
    
    if (artistNames.length > 0) {
      resident = artistNames.join(", ");
    }
  } else if (event.metadata?.artist) {
    resident = event.metadata.artist;
  }

  return {
    id: event.id,
    title: event.title,
    resident: resident,
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
        
        // Fetch artists and schedule concurrently
        const [artists, schedule] = await Promise.all([
          fetchArtists(),
          (async () => {
            // Get schedule for next 7 days
            const now = new Date();
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            const startDate = now.toISOString();
            const endDate = weekFromNow.toISOString();
            
            return await fetchSchedule(startDate, endDate, timezone);
          })()
        ]);
        
        if (schedule.success && Array.isArray(schedule.schedules)) {
          const formattedShows = schedule.schedules.map(event => formatEventToShow(event, artists));
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}