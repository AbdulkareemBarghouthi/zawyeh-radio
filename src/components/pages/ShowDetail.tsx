import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { AudioPlayer } from "../AudioPlayer";
import { Badge } from "../ui/badge";
import { ShowCard } from "../ShowCard";
import { Button } from "../ui/button";

import { useParams } from 'react-router-dom';

interface ShowDetailProps {
  onBack: () => void;
  onShowClick: (showId: string) => void;
}

export function ShowDetail({ onBack, onShowClick }: ShowDetailProps) {
  const { showId } = useParams();
  if (!showId) return null;
  // Mock show data based on ID
  const shows: Record<string, any> = {
    "1": {
      title: "Electronic Echoes",
      resident: "Alex Rivera",
      date: "October 3, 2025",
      time: "12:00 - 14:00",
      isLive: true,
      genre: "House",
      description:
        "A deep dive into the world of electronic music, from ambient soundscapes to driving techno. Alex Rivera takes you on a sonic journey through the underground.",
    },
    "2": {
      title: "Morning Frequencies",
      resident: "Maya Chen",
      date: "October 4, 2025",
      time: "08:00 - 10:00",
      isLive: false,
      genre: "Ambient",
      description:
        "Start your day with peaceful ambient soundscapes and experimental electronic textures. Maya Chen curates a calming morning atmosphere.",
    },
    "3": {
      title: "Warehouse Sessions",
      resident: "DJ Kofi",
      date: "October 4, 2025",
      time: "14:00 - 16:00",
      isLive: false,
      genre: "Techno",
      description:
        "Raw, industrial techno from the warehouse floors of Berlin and beyond. DJ Kofi brings the energy of underground club culture.",
    },
    "4": {
      title: "Late Night Jazz",
      resident: "Sara Martinez",
      date: "October 2, 2025",
      time: "22:00 - 00:00",
      isLive: false,
      genre: "Jazz",
      description:
        "Wind down with classic jazz, neo-soul, and modern jazz fusion. Sara Martinez explores the full spectrum of jazz music.",
    },
  };

  const show = shows[showId] || shows["1"];

  const relatedShows = [
    {
      id: "5",
      title: "Deep House Sessions",
      resident: "Luna Park",
      time: "Today 20:00",
      status: "upcoming" as const,
      genre: "Deep House",
    },
    {
      id: "6",
      title: "Urban Soundscapes",
      resident: "Yuki Tanaka",
      time: "Tomorrow 16:00",
      status: "upcoming" as const,
      genre: "Electronic",
    },
  ];

  return (
    <div className="pt-36 pb-32">
      <div className="max-w-4xl mx-auto px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-12 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-16">
          <h1 className="mb-8">{show.title}</h1>

          <div className="flex flex-wrap gap-8 text-muted-foreground mb-12">
            <span>{show.resident}</span>
            <span>{show.date}</span>
            <span>{show.time}</span>
          </div>

          <AudioPlayer
            isLive={show.isLive}
            showTitle={show.title}
            resident={show.resident}
          />
        </div>

        <div className="mb-16">
          <h2 className="mb-6">About</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {show.description}
          </p>
        </div>

        <div>
          <h2 className="mb-8">More Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedShows.map((relatedShow) => (
              <ShowCard
                key={relatedShow.id}
                {...relatedShow}
                onClick={() => onShowClick(relatedShow.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
