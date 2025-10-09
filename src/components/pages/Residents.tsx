import { useState, useEffect } from "react";
import { ResidentCard } from "../ResidentCard";
import axios from "axios";
import type { Artist } from "../../types/artist";

const API_KEY = "pk_5d456436ee8d4bb3b9a88e64d457a07e";
const API_BASE = "https://api.radiocult.fm/api/station/zawyeh-radio";

interface ResidentsProps {
  // Removed onResidentClick prop
}

export function Residents() {
  const [residents, setResidents] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResidents() {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`${API_BASE}/artists`, {
          headers: {
            "x-api-key": API_KEY,
          },
        });

        setResidents(data.artists);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load residents"
        );
      } finally {
        setLoading(false);
      }
    }

    loadResidents();
  }, []);

  return (
    <div className="pt-36 pb-32">
      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-16">
          <h1>Residents</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Meet the artists behind the sounds.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-8">{error}</div>
        ) : residents.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">No residents found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {residents.map((resident) => (
              <ResidentCard
                key={resident.id}
                name={resident.name}
                genres={resident.genres || []}
                logo={resident.logo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
