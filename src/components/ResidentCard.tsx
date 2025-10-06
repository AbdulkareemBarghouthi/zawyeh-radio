import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import fallbackImage from "../assets/fallback.png";

interface ResidentCardProps {
  name: string;
  genres: string[];
  logo?: Record<string, string>;
  onClick?: () => void;
}

export function ResidentCard({ name, logo, genres, onClick }: ResidentCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="aspect-square mb-5 overflow-hidden rounded-3xl bg-muted">
        <ImageWithFallback
          src={logo?.["512x512"] || logo?.default || fallbackImage}
          alt={name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
        />
      </div>
      <h3 className="mb-3 group-hover:text-accent transition-colors">{name}</h3>
      <p className="text-sm text-muted-foreground">{genres.join(" · ")}</p>
    </div>
  );
}
