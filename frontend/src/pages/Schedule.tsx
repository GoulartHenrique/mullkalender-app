import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../languages/LanguageContext";
import { ScheduleData } from "../types/schedule";

function Schedule() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const street = searchParams.get("street");
  const hnr = searchParams.get("hnr");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = language === "en" ? "en-GB" : "de-DE";
    return date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get(`/api/schedule?street=${street}&hnr=${hnr}`);
        setData(res.data);
      } catch {
        setError(t("schedule.error"));
      } finally {
        setLoading(false);
      }
    };

    if (street) fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [street, hnr]);

  if (loading) return (
    <div className="page-background min-h-screen text-white relative overflow-hidden flex items-center justify-center">
      <div className="page-overlay" />
      <p className="text-muted relative animate-pulse">{t("schedule.loading")}</p>
    </div>
  );

  if (error) return (
    <div className="page-background min-h-screen text-white relative overflow-hidden flex flex-col items-center justify-center gap-4">
      <div className="page-overlay" />
      <p className="relative text-red-400">{error}</p>
      <button onClick={() => navigate("/")} className="relative text-sm hover:underline"
        style={{ color: "var(--accent)" }}>
        {t("schedule.backToSearch")}
      </button>
    </div>
  );

  return (
    <div className="page-background min-h-screen text-white relative overflow-hidden">
      <div className="page-overlay" />

      <div className="relative max-w-2xl mx-auto px-4 py-10">

        <button onClick={() => navigate("/")}
          className="text-muted text-sm mb-6 flex items-center gap-1 transition hover:underline">
          {t("schedule.backToSearch")}
        </button>

        {/* Header */}
        <div className="glass-card px-6 py-5 mb-6">
          <h2 className="text-3xl font-bold mb-1">{data?.street} {data?.houseNumber}</h2>
          <p className="text-muted">{data?.district} · Erfurt</p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {data?.schedule.map((entry) => (
            <div key={entry.type} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <h3 className="font-semibold text-lg">{entry.type}</h3>
                <span className="text-faint ml-auto text-sm capitalize">
                  {entry.frequency}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {entry.dates.map((date, i) => (
                  <span
                    key={date}
                    className={
                      i === 0
                        ? "text-sm px-3 py-1 rounded-lg font-semibold"
                        : "bg-subtle text-tertiary text-sm px-3 py-1 rounded-lg font-semibold"
                    }
                    style={i === 0
                      ? { backgroundColor: entry.color, color: "var(--accent-bg)" }
                      : undefined
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
        <div className="glass-card mt-10 px-6 py-4 rounded-2xl text-center">
          <p className="text-subtle text-xs">
            {t("schedule.footer")} <span style={{ color: "var(--accent)" }}>SWE Stadtwirtschaft GmbH Erfurt</span> ·
          </p>
        </div>

      </div>
    </div>
  );
}

export default Schedule;