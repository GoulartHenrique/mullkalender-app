import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [street, setStreet] = useState("");
  const [hnr, setHnr] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!street) return;
    navigate(`/schedule?street=${street}&hnr=${hnr}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <span className="text-green-400 text-sm font-semibold tracking-widest uppercase">
          📍 Erfurt · SWE Stadtwirtschaft
        </span>
        <h1 className="text-5xl font-bold mt-4 mb-4">
          Müll richtig trennen,<br />
          <span className="text-green-400">Termine nie vergessen</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Gib deine Adresse ein und sieh sofort, wann welche Tonne abgeholt wird.
        </p>
      </div>

      <div className="flex gap-3 w-full max-w-xl">
        <input
          type="text"
          placeholder="Straße"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
        />
        <input
          type="text"
          placeholder="Nr."
          value={hnr}
          onChange={(e) => setHnr(e.target.value)}
          className="w-20 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
        />
        <button
          onClick={handleSearch}
          className="bg-green-400 text-gray-950 font-semibold px-6 py-3 rounded-xl hover:opacity-80 transition"
        >
          Suchen →
        </button>
      </div>
    </div>
  );
}

export default Home;