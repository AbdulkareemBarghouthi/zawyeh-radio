import { AudioPlayer } from "../AudioPlayer";
import { FeaturedShows, type Show } from "../FeaturedShows";

interface HomeProps {
  onShowClick: (showId: string) => void;
}

export function Home({ onShowClick }: HomeProps) {
  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="pt-36">
        <div className="max-w-6xl mx-auto px-8">
          <AudioPlayer
            isLive={true}
            showTitle="Electronic Echoes"
            resident="Alex Rivera"
          />
        </div>
      </section>

      <FeaturedShows onShowClick={onShowClick} />
    </div>
  );
}
