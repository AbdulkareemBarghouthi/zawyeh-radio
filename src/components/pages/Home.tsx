
import { FeaturedShows, type Show } from "../FeaturedShows";

interface HomeProps {
  onShowClick: (showId: string) => void;
}

export function Home({ onShowClick }: HomeProps) {
  return (
    <div className="pb-32 relative">
   

      <FeaturedShows onShowClick={onShowClick} />
    </div>
  );
}
