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

const wasteIcons: Record<string, string> = {
  "Biotonne": "🟢",
  "Gelber Sack": "🟡",
  "Papiertonne": "🔵",
  "Restmüll": "⚫",
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
        setError("Adresse nicht gefunden. Bitte versuche es erneut.");
      } finally {
        setLoading(false);
      }
    };

    if (street) fetchSchedule();
  }, [street, hnr]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Wird geladen...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
      <p className="text-red-400">{error}</p>
      <button
        onClick={() => navigate("/")}
        className="text-green-400 hover:underline text-sm"
      >
        ← Zurück zur Suche
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-green-400 text-sm mb-6 flex items-center gap-1 transition"
        >
          ← Zurück zur Suche
        </button>

        <h2 className="text-3xl font-bold mb-1">
          {data?.street} {data?.houseNumber}
        </h2>
        <p className="text-gray-400 mb-8">{data?.district} · Erfurt</p>

        <div className="flex flex-col gap-4">
          {data?.schedule.map((entry) => (
            <div
              key={entry.type}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
<div className="flex items-center gap-3 mb-4">
  <span className="text-xl">{wasteIcons[entry.type]}</span>
  <h3 className="font-semibold text-lg">{entry.type}</h3>
  <span className="ml-auto text-gray-500 text-sm capitalize">
    {entry.frequency}
  </span>
</div>

              <div className="flex flex-wrap gap-2">
                {entry.dates.map((date, i) => (
                  <span
                    key={date}
                    className={`text-sm px-3 py-1 rounded-lg ${
                      i === 0
                        ? "text-gray-950 font-semibold"
                        : "bg-gray-800 text-gray-400"
                    }`}
                    style={i === 0 ? { backgroundColor: entry.color } : {}}
                  >
                    {i === 0 ? "📅 " : ""}{formatDate(date)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Schedule;