import { useState, useEffect } from "react";
import api from "../services/api";

const accent = "#00aaff";

const glassCard: React.CSSProperties = {
  background: "rgba(20, 30, 45, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
};

interface ProfileData {
  email: string;
  address: { street: string; houseNumber: string; city: string };
  notifications: { enabled: boolean; daysBefore: number };
  language: "de" | "en";
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setProfile(res.data);
      } catch {
        setError("Profil konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const res = await api.put("/api/user/profile", {
        address: profile.address,
        notifications: profile.notifications,
        language: profile.language,
      });
      setProfile(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setSaving(false);
    }
  };

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
        <p className="relative animate-pulse" style={{ color: "rgba(255,255,255,0.5)" }}>Wird geladen...</p>
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
          <h2 className="text-2xl font-bold mb-2">Mein Profil</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{profile.email}</p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-sm mb-4" style={{ color: accent }}>Profil erfolgreich gespeichert!</p>}

        {/* Address */}
        <div className="p-5 mb-4" style={glassCard}>
          <h3 className="font-semibold mb-4">Lieblingsadresse</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Straße"
              value={profile.address.street}
              onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
              className="flex-1 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <input
              type="text"
              placeholder="Nr."
              value={profile.address.houseNumber}
              onChange={(e) => setProfile({ ...profile, address: { ...profile.address, houseNumber: e.target.value } })}
              className="w-full sm:w-20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            Diese Adresse wird beim Anmelden automatisch geladen.
          </p>
        </div>

        {/* Notifications */}
        <div className="p-5 mb-4" style={glassCard}>
          <h3 className="font-semibold mb-4">Erinnerungen</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Erinnerungen aktivieren</span>
            <button
              onClick={() => setProfile({ ...profile, notifications: { ...profile.notifications, enabled: !profile.notifications.enabled } })}
              className="w-12 h-6 rounded-full relative transition"
              style={{ background: profile.notifications.enabled ? accent : "rgba(255,255,255,0.15)" }}
            >
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                style={{ left: profile.notifications.enabled ? "26px" : "2px" }} />
            </button>
          </div>
          {profile.notifications.enabled && (
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Tage vorher benachrichtigen</span>
              <select
                value={profile.notifications.daysBefore}
                onChange={(e) => setProfile({ ...profile, notifications: { ...profile.notifications, daysBefore: Number(e.target.value) } })}
                className="rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <option value={1} style={{ background: "#0a1628" }}>1 Tag</option>
                <option value={2} style={{ background: "#0a1628" }}>2 Tage</option>
                <option value={3} style={{ background: "#0a1628" }}>3 Tage</option>
              </select>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="p-5 mb-6" style={glassCard}>
          <h3 className="font-semibold mb-4">Sprache</h3>
          <div className="flex gap-3">
            {(["de", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setProfile({ ...profile, language: lang })}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                style={profile.language === lang
                  ? { background: accent, color: "#060b13" }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
                }
              >
                {lang === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-semibold py-3 rounded-xl transition disabled:opacity-50"
          style={{ background: accent, color: "#060b13" }}
        >
          {saving ? "Wird gespeichert..." : "Speichern"}
        </button>

      </div>
    </div>
  );
}

export default Profile;