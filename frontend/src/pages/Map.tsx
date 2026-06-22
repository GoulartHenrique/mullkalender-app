import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../languages/LanguageContext";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Coordinates never change between languages, so they stay as a fixed
// lookup here, keyed by the same name used in the translated center data.
const coordinates: Record<string, { lat: number; lng: number }> = {
  "Wertstoffhof Lobensteiner Straße": { lat: 50.9929, lng: 11.0289 },
  "Wertstoffhof Eugen-Richter-Straße": { lat: 50.978, lng: 11.0456 },
  "Wertstoffhof Schwerborn": { lat: 51.0012, lng: 11.1234 },
};

interface RecyclingCenter {
  name: string;
  address: string;
  hours: string;
  accepts: string[];
}

function Map() {
  const { t } = useLanguage();
  const centers = t<RecyclingCenter[]>("map.centers");

  return (
    <div className="page-background min-h-screen text-white relative overflow-hidden">
      <div className="page-overlay" />

      <div className="relative max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="glass-card w-full px-6 py-5 mb-6">
          <h2 className="text-2xl font-bold mb-2">{t("map.title")}</h2>
          <p className="text-muted text-sm">
            {t("map.subtitle")}
          </p>
        </div>

        {/* Map */}
        <div className="glass-card overflow-hidden mb-6" style={{ height: "400px", padding: 0 }}>
          <MapContainer center={[50.9847, 11.0297]} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {centers.map((w) => {
              const coords = coordinates[w.name];
              if (!coords) return null;
              return (
                <Marker key={w.name} position={[coords.lat, coords.lng]}>
                  <Popup>
                    <strong>{w.name}</strong><br />
                    {w.address}<br />
                    <em>{w.hours}</em>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {centers.map((w) => (
            <div key={w.name} className="glass-card p-5">
              <h3 className="font-bold text-sm mb-1">{w.name}</h3>
              <p className="text-muted text-xs mb-1">📍 {w.address}</p>
              <p className="text-muted text-xs mb-3">🕐 {w.hours}</p>
              <div className="flex flex-wrap gap-2">
                {w.accepts.map((item) => (
                  <span key={item} className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ background: "rgba(0,170,255,0.1)", color: "var(--accent)", border: "1px solid rgba(0,170,255,0.3)" }}>
                    {item}
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

export default Map;