import { useState, useEffect } from "react";
import { ScheduleRow } from "../ScheduleRow";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import type { ScheduleResponse, ScheduleEvent } from "../../types/api";
import type { Artist, ArtistsResponse } from "../../types/artist";
import axios from "axios";

interface ScheduleProps {
  // Removed onShowClick prop
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  resident: string;
  status: "live" | "upcoming" | "past";
  genres: string[];
  tags: string[];
}

const API_KEY = "pk_5d456436ee8d4bb3b9a88e64d457a07e";
const API_BASE = "https://api.radiocult.fm/api/station/zawyeh-radio";
const TIMEZONE = "Asia/Amman";

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

async function fetchSchedule(date: Date) {
  // Set the start of the day and end of the day for the selected date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const { data } = await axios.get<ScheduleResponse>(`${API_BASE}/schedule`, {
      params: {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
        timezone: TIMEZONE,
      },
      headers: {
        "x-api-key": API_KEY,
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch schedule"
      );
    }
    throw error;
  }
}

function formatScheduleEvent(event: ScheduleEvent, artists: Artist[]): ScheduleItem {
  const start = new Date(event.startDateUtc);
  const end = new Date(event.endDateUtc);
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });

  const startTime = timeFormatter.format(start);
  const endTime = timeFormatter.format(end);

  let status: "live" | "upcoming" | "past" = "upcoming";
  if (now >= start && now <= end) {
    status = "live";
  } else if (now > end) {
    status = "past";
  }

  // Find artist info
  const artist = artists.find(a => 
    event.metadata?.artist?.toLowerCase() === a.name.toLowerCase() ||
    event.metadata?.artist?.toLowerCase() === a.slug?.toLowerCase()
  );

  return {
    id: event.id,
    time: `${startTime} - ${endTime}`,
    title: event.title,
    resident: event.metadata?.artist || "Various Artists",
    status,
    genres: artist?.genres || [],
    tags: artist?.tags || [],
  };
}

export function Schedule() {
  const [activeDay, setActiveDay] = useState("today");
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError(null);

        // Fetch artists first
        const artists = await fetchArtists();

        // Calculate the date based on activeDay
        const today = new Date();
        const targetDate = new Date(today);

        if (activeDay === "yesterday") {
          targetDate.setDate(today.getDate() - 1);
        } else if (activeDay === "tomorrow") {
          targetDate.setDate(today.getDate() + 1);
        }

        const response = await fetchSchedule(targetDate);

        if (response.success && response.schedules) {
          const events = response.schedules;

          const items = events.map(event => formatScheduleEvent(event, artists));

          setScheduleItems(items);
        } else {
          setScheduleItems([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load schedule"
        );
        setScheduleItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [activeDay]);

  return (
    <div className="pt-36 pb-32">
      <div className="max-w-5xl mx-auto px-8">
        <h1 className="mb-16">Schedule</h1>

        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-16">
            <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-8">{error}</div>
          ) : (
            <div
              className={[
                "rounded-3xl border border-white/10 bg-white/5 p-8",
                "backdrop-blur-xl shadow-[inset_0_1px_0_rgba(216, 132, 132, 0.15),0_10px_30px_rgba(0,0,0,.3)]",
                "ring-1 ring-white/10 transition-all duration-300",
              ].join(" ")}
            >
              {scheduleItems.length === 0 ? (
                <p className="text-center py-6 text-sm text-white/60 select-none">
                  No shows scheduled for{" "}
                  <span className="text-white/80 font-medium">
                    {activeDay === "today" ? "today" : activeDay}
                  </span>
                </p>
              ) : (
                <div className="divide-y divide-white/10">
                  {scheduleItems.map((show) => (
                    <div
                      key={show.id}
                      className="group transition-colors duration-200"
                    >
                      <ScheduleRow
                        {...show}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
