import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const accent = "#00aaff";

const glassCard = {
  background: "rgba(20, 30, 45, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const wertstoffhoefe = [
  {
    name: "Wertstoffhof Lobensteiner Straße",
    address: "Lobensteiner Str., 99086 Erfurt",
    lat: 50.9929,
    lng: 11.0289,
    hours: "Mo–Fr 8:00–18:00, Sa 8:00–14:00",
    accepts: ["Elektrogeräte", "Batterien", "Sperrmüll", "Grünschnitt"],
  },
  {
    name: "Wertstoffhof Eugen-Richter-Straße",
    address: "Eugen-Richter-Str., 99085 Erfurt",
    lat: 50.9780,
    lng: 11.0456,
    hours: "Mo–Fr 8:00–18:00, Sa 8:00–14:00",
    accepts: ["Elektrogeräte", "Batterien", "Sperrmüll", "Altöl"],
  },
  {
    name: "Wertstoffhof Schwerborn",
    address: "Schwerborn, 99195 Erfurt",
    lat: 51.0012,
    lng: 11.1234,
    hours: "Mo–Fr 7:00–16:00",
    accepts: ["Sonderabfall", "Chemikalien", "Farben"],
  },
];

function Map() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="w-full px-6 py-5 mb-6" style={glassCard}>
          <h2 className="text-2xl font-bold mb-2">Wertstoffhöfe in Erfurt</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Hier können Sie Sondermüll, Elektrogeräte und Sperrmüll kostenlos abgeben.
          </p>
        </div>

        {/* Map */}
        <div className="overflow-hidden mb-6" style={{
          ...glassCard,
          height: "400px",
          padding: 0,
        }}>
          <MapContainer center={[50.9847, 11.0297]} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {wertstoffhoefe.map((w) => (
              <Marker key={w.name} position={[w.lat, w.lng]}>
                <Popup>
                  <strong>{w.name}</strong><br />
                  {w.address}<br />
                  <em>{w.hours}</em>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {wertstoffhoefe.map((w) => (
            <div key={w.name} className="p-5" style={glassCard}>
              <h3 className="font-bold text-sm mb-1">{w.name}</h3>
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>📍 {w.address}</p>
              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>🕐 {w.hours}</p>
              <div className="flex flex-wrap gap-2">
                {w.accepts.map((item) => (
                  <span key={item} className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ background: "rgba(0,170,255,0.1)", color: accent, border: "1px solid rgba(0,170,255,0.3)" }}>
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