import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const accent = "#00aaff";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/api/auth/register", { email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative w-full max-w-md p-8 rounded-2xl" style={{
        background: "rgba(20, 30, 45, 0.4)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <h2 className="text-2xl font-bold mb-2">Registrieren</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Erstellen Sie Ihr Konto</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-sm mb-4" style={{ color: accent }}>Erfolgreich registriert! Weiterleitung...</p>}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl px-4 py-3 text-white focus:outline-none"
            style={{ background: "rgba(20,30,45,0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl px-4 py-3 text-white focus:outline-none"
            style={{ background: "rgba(20,30,45,0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
          />
          <button
            onClick={handleRegister}
            className="font-semibold py-3 rounded-xl transition"
            style={{ background: accent, color: "#060b13" }}
          >
            Registrieren
          </button>
        </div>

        <p className="text-sm text-center mt-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          Bereits ein Konto?{" "}
          <Link to="/login" className="hover:underline" style={{ color: accent }}>
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;