import { ResidentCard } from "../ResidentCard";

interface ResidentsProps {
  onResidentClick: (residentId: string) => void;
}

export function Residents({ onResidentClick }: ResidentsProps) {
  const residents = [
    {
      id: "1",
      name: "Alex Rivera",
      imageUrl: "https://images.unsplash.com/photo-1571933054329-fac6a78a6e36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTUxMzM2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["House", "Techno"],
    },
    {
      id: "2",
      name: "Maya Chen",
      imageUrl: "https://images.unsplash.com/photo-1641465431157-4fa4f99580e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NTk1MTMzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["Ambient", "Experimental"],
    },
    {
      id: "3",
      name: "DJ Kofi",
      imageUrl: "https://images.unsplash.com/photo-1582024959432-aee9b60ff4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwc3R1ZGlvfGVufDF8fHx8MTc1OTQ2NjQ1MHww&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["Techno", "Industrial"],
    },
    {
      id: "4",
      name: "Sara Martinez",
      imageUrl: "https://images.unsplash.com/photo-1675859427928-fe41277572b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTQ0MzQyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["Jazz", "Soul"],
    },
    {
      id: "5",
      name: "Luna Park",
      imageUrl: "https://images.unsplash.com/photo-1604138946535-91d37353d052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMG1pbmltYWx8ZW58MXx8fHwxNzU5NTEzMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["Deep House", "Disco"],
    },
    {
      id: "6",
      name: "Yuki Tanaka",
      imageUrl: "https://images.unsplash.com/photo-1758267928043-75fe880578db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMGhvc3QlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1OTUxMzM2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      genres: ["Electronic", "IDM"],
    },
  ];

  return (
    <div className="pt-36 pb-32">
      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-16">
          <h1 className="mb-6">Residents</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Meet the artists behind the sounds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {residents.map((resident) => (
            <ResidentCard
              key={resident.id}
              {...resident}
              onClick={() => onResidentClick(resident.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
