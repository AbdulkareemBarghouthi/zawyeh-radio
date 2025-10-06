import { AudioPlayer } from "../AudioPlayer";
import { FeaturedShows, type Show } from "../FeaturedShows";

interface HomeProps {
  onShowClick: (showId: string) => void;
}

export function Home({ onShowClick }: HomeProps) {
  return (
    <div className="pb-32 relative">
      <section className="pt-36 relative">
        <div className="max-w-6xl mx-auto px-8">
          <AudioPlayer />
        </div>
      </section>

      <FeaturedShows onShowClick={onShowClick} />
    </div>
  );
}
