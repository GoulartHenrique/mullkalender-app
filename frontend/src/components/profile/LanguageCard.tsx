import { useLanguage } from "../../languages/LanguageContext";

interface LanguageCardProps {
  selectedLanguage: "de" | "en";
  onSelectLanguage: (lang: "de" | "en") => void;
}

function LanguageCard({ selectedLanguage, onSelectLanguage }: LanguageCardProps) {
  const { t } = useLanguage();

  return (
    <div className="glass-card p-5 mb-6">
      <h3 className="font-semibold mb-4">{t("profile.language")}</h3>
      <div className="flex gap-3">
        {(["de", "en"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => onSelectLanguage(lang)}
            className={
              selectedLanguage === lang
                ? "flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                : "bg-subtle flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
            }
            style={
              selectedLanguage === lang
                ? { background: "var(--accent)", color: "var(--accent-bg)" }
                : { color: "rgba(255,255,255,0.6)" }
            }
          >
            {lang === "de" ? t("profile.german") : t("profile.english")}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageCard;