export interface Artist {
  id: string;
  stationId: string;
  name: string;
  slug?: string;
  socials: Record<string, string>;
  shareableLinkId: string;
  logo: Record<string, string>;
  tags: string[];
  genres: string[];
  created: string;
  modified: string;
}

export interface ArtistsResponse {
  artists: Artist[];
  success: boolean;
}