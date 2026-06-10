import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

function Schedule() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <p className="text-gray-400">Wird geladen...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          {data?.street} {data?.houseNumber}
        </h2>
        <p className="text-gray-400 mb-8">{data?.district} · Erfurt</p>

        <div className="grid grid-cols-1 gap-4">
          {data?.schedule.map((entry) => (
            <div
              key={entry.type}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div>
                  <h3 className="font-semibold text-lg">{entry.type}</h3>
                  <p className="text-gray-400 text-sm">
                    Nächste Abholung: {entry.dates[0]}
                  </p>
                </div>
              </div>
              <span className="text-gray-500 text-sm capitalize">{entry.frequency}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Schedule;