import { Instagram, Twitter } from "lucide-react";

interface FooterProps {
  isLive: boolean;
}

export function Footer({ isLive }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-accent animate-pulse" : "bg-muted-foreground"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {isLive ? "Stream Live" : "Stream Offline"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/zawyeh.radio"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Zawyeh Radio.  زاوية راديو.
          </p>
        </div>
      </div>
    </footer>
  );
}
