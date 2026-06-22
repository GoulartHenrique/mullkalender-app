import { useLanguage } from "../../languages/LanguageContext";
import { ScheduleData } from "../../types/schedule";

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

interface ScheduleDisplayProps {
  scheduleData: ScheduleData;
}

function ScheduleDisplay({ scheduleData }: ScheduleDisplayProps) {
  const { t, language } = useLanguage();

  const descriptions = t<Record<string, string>>("binDescriptions");
  const dateLocale = language === "en" ? "en-GB" : "de-DE";

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekDaysDe = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const weekDaysEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDays = language === "en" ? weekDaysEn : weekDaysDe;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const kw = getWeekNumber(today);

  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-1">
        <h2 className="text-lg sm:text-xl font-bold">{t("home.nextCollections")}</h2>
        <span className="text-muted text-xs sm:text-sm">
          {scheduleData.street} {scheduleData.houseNumber} · {scheduleData.district}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {scheduleData.schedule.map((entry, i) => {
          const nextDate = new Date(entry.dates[0]);
          const day = nextDate.toLocaleDateString(dateLocale, { day: "2-digit" });
          const month = nextDate.toLocaleDateString(dateLocale, { month: "short" });
          return (
            <div key={entry.type} className="glass-card p-4 sm:p-5 flex items-center justify-between"
              style={{ borderColor: i === 0 ? "rgba(0,170,255,0.5)" : "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <div>
                  <p className="font-bold text-sm">{entry.type}</p>
                  <p className="text-muted text-xs">{descriptions[entry.type]}</p>
                  {i === 0 && (
                    <span className="accent-badge inline-block mt-1.5 text-xs px-2 py-0.5 rounded-lg">
                      {t("home.nextCollectionBadge")}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-2xl sm:text-3xl leading-none" style={{ color: entry.color }}>{day}</p>
                <p className="text-faint text-xs mt-1">{month}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly strip */}
      <div className="glass-card p-4 sm:p-5">
        <p className="text-subtle text-xs uppercase tracking-widest mb-4">
          {t("home.thisWeek")} — KW {kw}
        </p>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {week.map((d, i) => {
            const dateStr = d.toISOString().split("T")[0];
            const isToday = d.toDateString() === today.toDateString();
            const dots = scheduleData.schedule.filter((entry) => entry.dates.includes(dateStr));
            return (
              <div key={i} className={isToday ? "accent-highlight flex flex-col items-center gap-1 py-2 rounded-xl" : "flex flex-col items-center gap-1 py-2 rounded-xl"}>
                <span className="text-subtle text-xs">{weekDays[i]}</span>
                <span className="font-bold text-xs sm:text-sm" style={{ color: isToday ? "var(--accent)" : "white" }}>
                  {d.toLocaleDateString(dateLocale, { day: "2-digit" })}
                </span>
                <div className="flex gap-0.5 sm:gap-1">
                  {dots.map((dot, j) => (
                    <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot.color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ScheduleDisplay;