import { ArrowLeft, Instagram, Twitter, Globe } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { ShowCard } from "../ShowCard";
import { Button } from "../ui/button";

import { useParams } from 'react-router-dom';

interface ResidentDetailProps {
  onBack: () => void;
  onShowClick: (showId: string) => void;
}

export function ResidentDetail({ onBack, onShowClick }: ResidentDetailProps) {
  const { residentId } = useParams();
  if (!residentId) return null;
  const residents: Record<string, any> = {
    "1": {
      name: "Alex Rivera",
      imageUrl: "https://images.unsplash.com/photo-1571933054329-fac6a78a6e36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTUxMzM2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["House", "Techno"],
      location: "Berlin, Germany",
      bio: "Alex Rivera is a Berlin-based DJ and producer known for blending deep house grooves with driving techno rhythms. With over a decade of experience in underground club culture, Alex brings an infectious energy to every set.",
      shows: [
        {
          id: "1",
          title: "Electronic Echoes",
          resident: "Alex Rivera",
          time: "Today 12:00",
          status: "live" as const,
          genre: "House",
        },
        {
          id: "11",
          title: "Midday Mix",
          resident: "Alex Rivera",
          time: "Tomorrow 12:00",
          status: "upcoming" as const,
          genre: "Techno",
        },
      ],
    },
    "2": {
      name: "Maya Chen",
      imageUrl: "https://images.unsplash.com/photo-1641465431157-4fa4f99580e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NTk1MTMzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["Ambient", "Experimental"],
      location: "Tokyo, Japan",
      bio: "Maya Chen creates immersive soundscapes that blur the boundaries between ambient, experimental, and electronic music. Her shows are meditative journeys through sound and texture.",
      shows: [
        {
          id: "2",
          title: "Morning Frequencies",
          resident: "Maya Chen",
          time: "Tomorrow 08:00",
          status: "upcoming" as const,
          genre: "Ambient",
        },
      ],
    },
  };

  const resident = residents[residentId] || residents["1"];

  return (
    <div className="pt-36 pb-32">
      <div className="max-w-5xl mx-auto px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-12 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-16 mb-20">
          <div>
            <div className="aspect-square mb-8 overflow-hidden rounded-3xl bg-muted">
              <ImageWithFallback
                src={resident.imageUrl}
                alt={resident.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {resident.genres.join(" · ")}
              </p>
              <div className="flex gap-5">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h1 className="mb-3">{resident.name}</h1>
            <p className="text-muted-foreground mb-10">{resident.location}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{resident.bio}</p>
          </div>
        </div>

        <div>
          <h2 className="mb-8">Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resident.shows.map((show: any) => (
              <ShowCard
                key={show.id}
                {...show}
                onClick={() => onShowClick(show.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
