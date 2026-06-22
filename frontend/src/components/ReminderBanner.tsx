import { useState } from "react";
import { useLanguage } from "../languages/LanguageContext";
import { UpcomingReminder } from "../utils/reminders";

const STORAGE_KEY = "mullkalender_reminders_dismissed_on";

// Today's date, marks banner as dismissed
function getTodayKey(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .split("T")[0];
}

function loadDismissedDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveDismissedDate(dateKey: string) {
  try {
    localStorage.setItem(STORAGE_KEY, dateKey);
  } catch {
    // localStorage unavailable (e.g. private browsing) — dismissal just
    // won't persist across reloads, which is an acceptable fallback.
  }
}

interface ReminderBannerProps {
  reminders: UpcomingReminder[];
}

function ReminderBanner({ reminders }: ReminderBannerProps) {
  const { t } = useLanguage();
  const [dismissedOn, setDismissedOn] = useState<string | null>(() => loadDismissedDate());

  const todayKey = getTodayKey();
  const isDismissedToday = dismissedOn === todayKey;

  if (reminders.length === 0 || isDismissedToday) return null;

  const handleDismiss = () => {
    setDismissedOn(todayKey);
    saveDismissedDate(todayKey);
  };

  const formatDaysUntil = (daysUntil: number): string => {
    if (daysUntil === 0) return t("reminders.today");
    if (daysUntil === 1) return t("reminders.tomorrow");
    return t("reminders.inDays").replace("{n}", String(daysUntil));
  };

  return (
    <div className="glass-card mb-6 p-4 sm:p-5 relative" style={{ borderColor: "rgba(0,170,255,0.4)" }}>
      <button
        onClick={handleDismiss}
        aria-label="Close"
        className="text-faint absolute top-3 right-3 text-sm leading-none transition hover:opacity-100"
        style={{ opacity: 0.7 }}
      >
        ✕
      </button>

      <p className="text-xs uppercase tracking-widest mb-3 pr-6" style={{ color: "var(--accent)" }}>
        🔔 {t("reminders.title")}
      </p>
      <div className="flex flex-col gap-2">
        {reminders.map((reminder) => (
          <div key={`${reminder.type}__${reminder.date}`} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: reminder.color }} />
            <span className="text-sm font-semibold">{reminder.type}</span>
            <span className="text-tertiary text-sm ml-auto">
              {formatDaysUntil(reminder.daysUntil)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReminderBanner;