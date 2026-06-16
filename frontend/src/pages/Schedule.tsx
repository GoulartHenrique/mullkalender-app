import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface WasteEntry {
  type: string;
  color: string;
  dates: string[];
  frequency: string;
}

interface ScheduleData {
  street: string;
  houseNumber: string;
  district: string;
  schedule: WasteEntry[];
}

const accent = "#00aaff";

const glassCard: React.CSSProperties = {
  background: "rgba(20, 30, 45, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function Schedule() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const street = searchParams.get("street");
  const hnr = searchParams.get("hnr");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get(`/api/schedule?street=${street}&hnr=${hnr}`);
        setData(res.data);
      } catch {
        setError("Adresse nicht gefunden. Bitte versuchen Sie es erneut.");
      } finally {
        setLoading(false);
      }
    };

    if (street) fetchSchedule();
  }, [street, hnr]);

  if (loading) return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />
      <p className="relative animate-pulse" style={{ color: "rgba(255,255,255,0.5)" }}>Wird geladen...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col items-center justify-center gap-4" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />
      <p className="relative text-red-400">{error}</p>
      <button onClick={() => navigate("/")} className="relative text-sm hover:underline"
        style={{ color: accent }}>
        ← Zurück zur Suche
      </button>
    </div>
  );

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative max-w-2xl mx-auto px-4 py-10">

        <button onClick={() => navigate("/")}
          className="text-sm mb-6 flex items-center gap-1 transition hover:underline"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          ← Zurück zur Suche
        </button>

        {/* Header */}
        <div className="px-6 py-5 mb-6" style={glassCard}>
          <h2 className="text-3xl font-bold mb-1">{data?.street} {data?.houseNumber}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>{data?.district} · Erfurt</p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {data?.schedule.map((entry) => (
            <div key={entry.type} className="p-5" style={glassCard}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <h3 className="font-semibold text-lg">{entry.type}</h3>
                <span className="ml-auto text-sm capitalize" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {entry.frequency}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {entry.dates.map((date, i) => (
                  <span
                    key={date}
                    className="text-sm px-3 py-1 rounded-lg font-semibold"
                    style={i === 0
                      ? { backgroundColor: entry.color, color: "#060b13" }
                      : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
                    }
                  >
                    {i === 0 ? "📅 " : ""}{formatDate(date)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 px-6 py-4 rounded-2xl text-center" style={glassCard}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Daten von <span style={{ color: accent }}>SWE Stadtwirtschaft GmbH Erfurt</span> ·
          </p>
        </div>

      </div>
    </div>
  );
}

export default Schedule;