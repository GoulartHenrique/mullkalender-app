import { useLanguage } from "../../languages/LanguageContext";

function HomeHero() {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-8 sm:mb-10">
      <div className="glass-card w-full px-8 py-6 rounded-2xl mb-6">
        <span className="accent-badge inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
          {t("home.badge")}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
          {t("home.heroTitleLine1")}<br />
          <span style={{ color: "var(--accent)" }}>{t("home.heroTitleLine2")}</span>
        </h1>
        <p className="text-secondary text-base sm:text-lg max-w-xl mx-auto">
          {t("home.heroSubtitle")}
        </p>
      </div>
    </div>
  );
}

export default HomeHero;