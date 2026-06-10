import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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
      setError("Registrierung fehlgeschlagen. Versuche es erneut.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Registrieren</h2>
        <p className="text-gray-400 text-sm mb-6">Erstelle dein Konto</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">Erfolgreich registriert! Weiterleitung...</p>}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={handleRegister}
            className="bg-green-400 text-gray-950 font-semibold py-3 rounded-xl hover:opacity-80 transition"
          >
            Registrieren
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-6">
          Bereits ein Konto?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;