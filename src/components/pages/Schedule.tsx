import { useState, useEffect } from "react";
import { ScheduleRow } from "../ScheduleRow";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import type { ScheduleResponse, ScheduleEvent } from "../../types/api";
import axios from "axios";

interface ScheduleProps {
  onShowClick: (showId: string) => void;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  resident: string;
  status: "live" | "upcoming" | "past";
}

const API_KEY = "pk_5d456436ee8d4bb3b9a88e64d457a07e";
const API_BASE = "https://api.radiocult.fm/api/station/zawyeh-radio";
const TIMEZONE = "Asia/Amman";

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
        'x-api-key': API_KEY,
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch schedule');
    }
    throw error;
  }
}

function formatScheduleEvent(event: ScheduleEvent): ScheduleItem {
  const start = new Date(event.startDateUtc);
  const end = new Date(event.endDateUtc);
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
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

  return {
    id: event.id,
    time: `${startTime} - ${endTime}`,
    title: event.title,
    resident: event.metadata?.artist || "Various Artists",
    status,
  };
}

export function Schedule({ onShowClick }: ScheduleProps) {
  const [activeDay, setActiveDay] = useState("today");
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError(null);

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


          const items = events.map(formatScheduleEvent)
            .sort((a, b) => {
              const timeA = a.time.split(" - ")[0];
              const timeB = b.time.split(" - ")[0];
              return timeA.localeCompare(timeB);
            });

          setScheduleItems(items);
        } else {
          setScheduleItems([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedule');
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
            <div className="text-destructive text-center py-8">
              {error}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-8">
              {scheduleItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No shows scheduled for {activeDay === "today" ? "today" : activeDay}
                </p>
              ) : (
                scheduleItems.map((show) => (
                  <ScheduleRow
                    key={show.id}
                    {...show}
                    onClick={() => onShowClick(show.id)}
                  />
                ))
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
