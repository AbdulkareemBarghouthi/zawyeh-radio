import { useEffect, useState } from "react";

export function VUMeter() {
  const [bars, setBars] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(
        Array.from({ length: 5 }, () => Math.random() * 0.6 + 0.4)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-1.5 h-8">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-accent/80 rounded-full transition-all duration-100 ease-out"
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </div>
  );
}
