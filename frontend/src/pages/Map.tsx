import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-2">Wertstoffhöfe in Erfurt</h2>
        <p className="text-gray-400 text-sm mb-6">
          Hier können Sie Sondermüll, Elektrogeräte und Sperrmüll kostenlos abgeben.
        </p>

        <div className="rounded-2xl overflow-hidden border border-gray-800 mb-8" style={{ height: "400px" }}>
          <MapContainer
            center={[50.9847, 11.0297]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
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

        <div className="flex flex-col gap-4">
          {wertstoffhoefe.map((w) => (
            <div key={w.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-1">{w.name}</h3>
              <p className="text-gray-400 text-xs mb-1">📍 {w.address}</p>
              <p className="text-gray-400 text-xs mb-3">🕐 {w.hours}</p>
              <div className="flex flex-wrap gap-2">
                {w.accepts.map((item) => (
                  <span key={item} className="text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded-lg">
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