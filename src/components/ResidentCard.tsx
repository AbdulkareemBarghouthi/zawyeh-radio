import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";

interface ResidentCardProps {
  name: string;
  imageUrl: string;
  genres: string[];
  onClick?: () => void;
}

export function ResidentCard({ name, imageUrl, genres, onClick }: ResidentCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="aspect-square mb-5 overflow-hidden rounded-3xl bg-muted">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
        />
      </div>
      <h3 className="mb-3 group-hover:text-accent transition-colors">{name}</h3>
      <p className="text-sm text-muted-foreground">{genres.join(" · ")}</p>
    </div>
  );
}
