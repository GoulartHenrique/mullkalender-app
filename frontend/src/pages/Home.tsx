import { useState, useRef, useEffect } from "react";
import api from "../services/api";

interface WasteEntry {
  type: string;
  color: string;
  dates: string[];
  frequency: string;
}

interface ScheduleData {
  street: string;
  houseNumber: string;
  district: string;
  schedule: WasteEntry[];
}

interface Message {
  role: "user" | "ai";
  content: string;
}

const descriptions: Record<string, string> = {
  "Biotonne": "Bioabfälle, Lebensmittelreste",
  "Gelber Sack": "Verpackungen, Plastik, Metall",
  "Papiertonne": "Papier, Pappe, Karton",
  "Restmüll": "Hausmüll, nicht trennbarer Abfall",
};

const suggestions = [
  "Wo kommt eine Batterie rein?",
  "Ist Pizzakarton Papiertonne?",
  "Was gehört in den Gelben Sack?",
  "Wo entsorge ich Medikamente?",
];

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

function Home() {
  const [street, setStreet] = useState("");
  const [hnr, setHnr] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hallo! Ich helfe dir bei Fragen zur Mülltrennung in Erfurt. Was möchtest du wissen? 🗑️" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async () => {
    if (!street) return;
    setScheduleLoading(true);
    setScheduleError("");
    setScheduleData(null);
    try {
      const res = await api.get(`/api/schedule?street=${street}&hnr=${hnr}`);
      setScheduleData(res.data);
    } catch {
      setScheduleError("Adresse nicht gefunden. Bitte versuche es erneut.");
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSend = async (text?: string) => {
    const message = text ?? chatInput;
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await api.post("/api/ai/chat", { message });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Es gab einen Fehler. Bitte versuche es erneut." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  // Weekly strip logic
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const kw = getWeekNumber(today);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-block bg-green-400/10 text-green-400 border border-green-400/20 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            📍 Erfurt · SWE Stadtwirtschaft
          </span>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Müll richtig trennen,<br />
            <span className="text-green-400">Termine nie vergessen</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Gib deine Adresse ein und sieh sofort, wann welche Tonne abgeholt wird. Frag unsere KI, wohin jedes Teil gehört.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Straße"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <input
            type="text"
            placeholder="Nr."
            value={hnr}
            onChange={(e) => setHnr(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-20 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={handleSearch}
            className="bg-green-400 text-gray-950 font-semibold px-6 py-3 rounded-xl hover:opacity-80 transition"
          >
            Suchen →
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-10">
          Beispiele:{" "}
          {["Anger", "Bahnhofstraße", "Krämerbrücke"].map((s) => (
            <span
              key={s}
              className="text-gray-400 cursor-pointer hover:text-green-400 transition mr-2"
              onClick={() => { setStreet(s); setHnr("1"); }}
            >
              {s}
            </span>
          ))}
        </p>

        {/* Schedule loading / error */}
        {scheduleLoading && (
          <p className="text-gray-400 animate-pulse text-center mb-10">Wird geladen...</p>
        )}
        {scheduleError && (
          <p className="text-red-400 text-center mb-10">{scheduleError}</p>
        )}

        {/* Schedule data */}
        {scheduleData && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Nächste Abholtermine</h2>
              <span className="text-gray-400 text-sm">
                {scheduleData.street} {scheduleData.houseNumber} · {scheduleData.district}
              </span>
            </div>

            {/* Dashboard cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {scheduleData.schedule.map((entry, i) => {
                const nextDate = new Date(entry.dates[0]);
                const day = nextDate.toLocaleDateString("de-DE", { day: "2-digit" });
                const month = nextDate.toLocaleDateString("de-DE", { month: "short" });
                return (
                  <div
                    key={entry.type}
                    className={`bg-gray-900 border rounded-2xl p-5 flex items-center justify-between ${
                      i === 0 ? "border-green-400/50" : "border-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                      <div>
                        <p className="font-bold text-sm">{entry.type}</p>
                        <p className="text-gray-400 text-xs">{descriptions[entry.type]}</p>
                        {i === 0 && (
                          <span className="inline-block mt-1.5 text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded-lg">
                            Nächste Abholung
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-3xl leading-none" style={{ color: entry.color }}>{day}</p>
                      <p className="text-gray-400 text-xs mt-1">{month}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly strip */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                Diese Woche — KW {kw}
              </p>
              <div className="grid grid-cols-7 gap-2">
                {week.map((d, i) => {
                  const dateStr = d.toISOString().split("T")[0];
                  const isToday = d.toDateString() === today.toDateString();
                  const dots = scheduleData.schedule.filter((entry) =>
                    entry.dates.includes(dateStr)
                  );
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1.5 py-2 rounded-xl ${
                        isToday ? "bg-gray-800 border border-gray-700" : ""
                      }`}
                    >
                      <span className="text-xs text-gray-500">{weekDays[i]}</span>
                      <span className={`font-bold text-sm ${isToday ? "text-green-400" : "text-white"}`}>
                        {d.toLocaleDateString("de-DE", { day: "2-digit" })}
                      </span>
                      <div className="flex gap-1">
                        {dots.map((dot, j) => (
                          <div
                            key={j}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: dot.color }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chat */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-sm">🤖</div>
            <div>
              <p className="font-semibold text-sm">MüllBot</p>
              <p className="text-green-400 text-xs">KI-Assistent · Erfurt</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
          </div>

          <div className="px-5 py-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-green-400 text-gray-950 font-medium rounded-br-sm"
                    : "bg-gray-800 text-white border border-gray-700 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-gray-400 animate-pulse">
                  Wird bearbeitet...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-xl hover:border-green-400 hover:text-green-400 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-800 flex gap-3">
            <input
              type="text"
              placeholder="Wo kommt... rein? Wann wird... abgeholt?"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={chatLoading}
              className="bg-green-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl hover:opacity-80 transition disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-10">
          Daten von <span className="text-green-400">SWE Stadtwirtschaft GmbH Erfurt</span> · Gebaut mit React + Express + MongoDB
        </p>

      </div>
    </div>
  );
}

export default Home;