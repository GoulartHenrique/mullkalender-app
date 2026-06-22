import { useLanguage } from "../../languages/LanguageContext";

interface NotificationsCardProps {
  enabled: boolean;
  daysBefore: number;
  onToggleEnabled: () => void;
  onChangeDaysBefore: (days: number) => void;
}

function NotificationsCard({
  enabled,
  daysBefore,
  onToggleEnabled,
  onChangeDaysBefore,
}: NotificationsCardProps) {
  const { t } = useLanguage();

  return (
    <div className="glass-card p-5 mb-4">
      <h3 className="font-semibold mb-4">{t("profile.reminders")}</h3>
      <div className="flex items-center justify-between mb-3">
        <span className="text-secondary text-sm">{t("profile.remindersEnable")}</span>
        <button
          onClick={onToggleEnabled}
          className="w-12 h-6 rounded-full relative transition"
          style={{ background: enabled ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
        >
          <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
            style={{ left: enabled ? "26px" : "2px" }} />
        </button>
      </div>
      {enabled && (
        <div className="flex items-center justify-between">
          <span className="text-secondary text-sm">{t("profile.daysBefore")}</span>
          <select
            value={daysBefore}
            onChange={(e) => onChangeDaysBefore(Number(e.target.value))}
            className="bg-subtle rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
          >
            <option value={1} style={{ background: "#0a1628" }}>{t("profile.day1")}</option>
            <option value={2} style={{ background: "#0a1628" }}>{t("profile.day2")}</option>
            <option value={3} style={{ background: "#0a1628" }}>{t("profile.day3")}</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default NotificationsCard;