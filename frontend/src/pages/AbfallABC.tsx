import { useState, useEffect } from "react";
import api from "../services/api";

interface WasteItem {
  _id: string;
  name: string;
  aliases: string[];
  category: string;
  bin: string | null;
  instruction: string;
  dropOffPoints: string[];
  icon: string;
}

const accent = "#00aaff";

const glassCard: React.CSSProperties = {
  background: "rgba(20, 30, 45, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
};

const categoryColors: Record<string, string> = {
  "Biotonne": "#4ade80",
  "Gelber Sack": "#facc15",
  "Papiertonne": "#60a5fa",
  "Restmüll": "#9ca3af",
  "Sondermüll": "#f87171",
};

function AbfallABC() {
  const [items, setItems] = useState<WasteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/api/waste-items/all");
        setItems(res.data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-10">

        {/* Header */}
        <div className="w-full px-6 py-5 mb-6" style={glassCard}>
          <h2 className="text-2xl font-bold mb-2">Abfall-ABC</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Suchen Sie nach einem Gegenstand und finden Sie heraus, wie er richtig entsorgt wird.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="z.B. Batterie, Pizzakarton, Glasflasche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-white text-sm mb-6 focus:outline-none"
          style={{ background: "rgba(20, 30, 45, 0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
        />

        {loading && (
          <p className="text-center animate-pulse" style={{ color: "rgba(255,255,255,0.5)" }}>Wird geladen...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center" style={{ color: "rgba(255,255,255,0.5)" }}>Keine Ergebnisse gefunden.</p>
        )}

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div key={item._id} className="p-5" style={glassCard}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-lg mt-1"
                    style={{
                      background: `${categoryColors[item.category]}20`,
                      color: categoryColors[item.category] || accent,
                      border: `1px solid ${categoryColors[item.category]}50`,
                    }}>
                    {item.category}
                  </span>
                </div>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{item.instruction}</p>
              {item.dropOffPoints.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.dropOffPoints.map((point) => (
                    <span key={point} className="text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                      📍 {point}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 px-6 py-4 rounded-2xl text-center" style={glassCard}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Daten von <span style={{ color: accent }}>SWE Stadtwirtschaft GmbH Erfurt</span> · Gebaut mit React + Express + MongoDB
          </p>
        </div>

      </div>
    </div>
  );
}

export default AbfallABC;