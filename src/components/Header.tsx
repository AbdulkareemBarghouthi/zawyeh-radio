import { Radio } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const navItems = [
    { id: "home", label: "Live" },
    { id: "schedule", label: "Schedule" },
    { id: "residents", label: "Residents" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <Radio className="w-5 h-5" />
          <span className="tracking-tight">WAVELENGTH</span>
        </button>

        <nav className="flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative hover:opacity-70 transition-opacity ${
                currentPage === item.id ? "opacity-100" : "opacity-40"
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
