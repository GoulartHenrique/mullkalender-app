import { useLanguage } from "../languages/LanguageContext";
import { useProfile } from "../hooks/useProfile";
import FavoriteAddressCard from "../components/profile/FavoriteAddressCard";
import NotificationsCard from "../components/profile/NotificationsCard";
import LanguageCard from "../components/profile/LanguageCard";

const accent = "#00aaff";

const glassCard: React.CSSProperties = {
  background: "rgba(20, 30, 45, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
};

function Profile() {
  const { t } = useLanguage();
  const {
    profile,
    loading,
    saving,
    success,
    error,
    streetQuery,
    selectedStreet,
    handleStreetQueryChange,
    handleSelectStreet,
    handleSelectHouseNumber,
    handleToggleNotifications,
    handleChangeDaysBefore,
    handleSelectLanguage,
    handleSave,
  } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center" style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
        }} />
        <p className="relative animate-pulse" style={{ color: "rgba(255,255,255,0.5)" }}>{t("profile.loading")}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative max-w-2xl mx-auto px-4 py-8 sm:py-10">

        {/* Header */}
        <div className="w-full px-6 py-5 mb-6" style={glassCard}>
          <h2 className="text-2xl font-bold mb-2">{t("profile.title")}</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{profile.email}</p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-sm mb-4" style={{ color: accent }}>{t("profile.saveSuccess")}</p>}

        <FavoriteAddressCard
          streetQuery={streetQuery}
          selectedStreet={selectedStreet}
          currentHouseNumber={profile.address.houseNumber}
          onStreetQueryChange={handleStreetQueryChange}
          onSelectStreet={handleSelectStreet}
          onSelectHouseNumber={handleSelectHouseNumber}
        />

        <NotificationsCard
          enabled={profile.notifications.enabled}
          daysBefore={profile.notifications.daysBefore}
          onToggleEnabled={handleToggleNotifications}
          onChangeDaysBefore={handleChangeDaysBefore}
        />

        <LanguageCard
          selectedLanguage={profile.language}
          onSelectLanguage={handleSelectLanguage}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-semibold py-3 rounded-xl transition disabled:opacity-50"
          style={{ background: accent, color: "#060b13" }}
        >
          {saving ? t("profile.saving") : t("profile.save")}
        </button>

      </div>
    </div>
  );
}

export default Profile;