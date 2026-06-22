import { useState, useEffect } from "react";
import api from "../services/api";
import { useLanguage } from "../languages/LanguageContext";

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
  const { t } = useLanguage();

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
    <div className="page-background page-background-fixed min-h-screen text-white relative overflow-hidden">
      <div className="page-overlay" />

      <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-10">

        {/* Header */}
        <div className="glass-card w-full px-6 py-5 mb-6">
          <h2 className="text-2xl font-bold mb-2">{t("abfallABC.title")}</h2>
          <p className="text-muted text-sm">
            {t("abfallABC.subtitle")}
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder={t("abfallABC.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input w-full rounded-xl px-4 py-3 text-white text-sm mb-6 focus:outline-none"
        />

        {loading && (
          <p className="text-muted text-center animate-pulse">{t("abfallABC.loading")}</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-muted text-center">{t("abfallABC.noResults")}</p>
        )}

        {/* Items grid */}
        {/* Note: item.name, item.category, item.instruction and
            item.dropOffPoints come from the database in German. Full
            translation of this dynamic content would require storing
            an English version per item, which is out of scope for now —
            only the static page text around it is translated. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div key={item._id} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-lg mt-1"
                    style={{
                      background: `${categoryColors[item.category]}20`,
                      color: categoryColors[item.category] || "var(--accent)",
                      border: `1px solid ${categoryColors[item.category]}50`,
                    }}>
                    {item.category}
                  </span>
                </div>
              </div>
              <p className="text-secondary text-sm">{item.instruction}</p>
              {item.dropOffPoints.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.dropOffPoints.map((point) => (
                    <span key={point} className="text-tertiary text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      📍 {point}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="glass-card mt-10 px-6 py-4 rounded-2xl text-center">
          <p className="text-subtle text-xs">
            {t("abfallABC.footer")} <span style={{ color: "var(--accent)" }}>SWE Stadtwirtschaft GmbH Erfurt</span> {t("abfallABC.footerSuffix")}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AbfallABC;