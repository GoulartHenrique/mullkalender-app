import { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
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

const accent = "#00aaff";

const glassCard: React.CSSProperties = {
  background: "rgba(20, 30, 45, 0.4)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
};

function Home() {
  const [street, setStreet] = useState("");
  const [hnr, setHnr] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hallo! Ich helfe Ihnen bei Fragen zur Mülltrennung in Erfurt. Was möchten Sie wissen? 🗑️" }
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
      setScheduleError("Adresse nicht gefunden. Bitte versuchen Sie es erneut.");
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
      setMessages((prev) => [...prev, { role: "ai", content: "Es gab einen Fehler. Bitte versuchen Sie es erneut." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const mimeType = file.type;
      setMessages((prev) => [...prev, { role: "user", content: "📷 Foto gesendet" }]);
      setChatLoading(true);
      try {
        const res = await api.post("/api/ai/photo", { image: base64, mimeType });
        setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "ai", content: "Es gab einen Fehler. Bitte versuchen Sie es erneut." }]);
      } finally {
        setChatLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

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
<div className="min-h-screen text-white relative overflow-hidden" style={{
  backgroundImage: "url('/bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
}}>

      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-16">

        {/* Hero */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-full px-8 py-6 rounded-2xl mb-6" style={glassCard}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(0,170,255,0.15)", border: "1px solid rgba(0,170,255,0.4)", color: accent }}>
              📍 Erfurt · SWE Stadtwirtschaft
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              Müll richtig trennen,<br />
              <span style={{ color: accent }}>Termine nie vergessen</span>
            </h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              Geben Sie Ihre Adresse ein und sehen Sie sofort, wann welche Tonne abgeholt wird. Fragen Sie unsere KI, wohin jedes Teil gehört.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
          <div className="flex gap-2 sm:gap-3 flex-1">
            <input
              type="text"
              placeholder="Straße"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-xl px-4 py-3 text-white text-sm sm:text-base focus:outline-none"
              style={{ background: "rgba(20, 30, 45, 0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
            />
            <input
              type="text"
              placeholder="Nr."
              value={hnr}
              onChange={(e) => setHnr(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-16 sm:w-20 rounded-xl px-3 sm:px-4 py-3 text-white text-sm sm:text-base focus:outline-none"
              style={{ background: "rgba(20, 30, 45, 0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="font-semibold px-6 py-3 rounded-xl transition text-sm sm:text-base w-full sm:w-auto"
            style={{ background: accent, color: "#060b13" }}
          >
            Suchen →
          </button>
        </div>

        <p className="text-xs sm:text-sm mb-8 sm:mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
          Beispiele:{" "}
          {["Anger", "Bahnhofstraße", "Krämerbrücke"].map((s) => (
            <span key={s} className="cursor-pointer transition mr-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
              onClick={() => { setStreet(s); setHnr("1"); }}>
              {s}
            </span>
          ))}
        </p>

        {scheduleLoading && <p className="text-center mb-10 animate-pulse" style={{ color: "rgba(255,255,255,0.5)" }}>Wird geladen...</p>}
        {scheduleError && <p className="text-red-400 text-center mb-10">{scheduleError}</p>}

        {/* Schedule data */}
        {scheduleData && (
          <div className="mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-1">
              <h2 className="text-lg sm:text-xl font-bold">Nächste Abholtermine</h2>
              <span className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                {scheduleData.street} {scheduleData.houseNumber} · {scheduleData.district}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {scheduleData.schedule.map((entry, i) => {
                const nextDate = new Date(entry.dates[0]);
                const day = nextDate.toLocaleDateString("de-DE", { day: "2-digit" });
                const month = nextDate.toLocaleDateString("de-DE", { month: "short" });
                return (
                  <div key={entry.type} className="p-4 sm:p-5 flex items-center justify-between"
                    style={{
                      ...glassCard,
                      borderColor: i === 0 ? "rgba(0,170,255,0.5)" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <div>
                        <p className="font-bold text-sm">{entry.type}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{descriptions[entry.type]}</p>
                        {i === 0 && (
                          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-lg"
                            style={{ background: "rgba(0,170,255,0.15)", color: accent, border: "1px solid rgba(0,170,255,0.4)" }}>
                            Nächste Abholung
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-2xl sm:text-3xl leading-none" style={{ color: entry.color }}>{day}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{month}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly strip */}
            <div className="p-4 sm:p-5" style={glassCard}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                Diese Woche — KW {kw}
              </p>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {week.map((d, i) => {
                  const dateStr = d.toISOString().split("T")[0];
                  const isToday = d.toDateString() === today.toDateString();
                  const dots = scheduleData.schedule.filter((entry) => entry.dates.includes(dateStr));
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 py-2 rounded-xl"
                      style={isToday ? { background: "rgba(0,170,255,0.15)", border: "1px solid rgba(0,170,255,0.4)" } : {}}>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{weekDays[i]}</span>
                      <span className="font-bold text-xs sm:text-sm" style={{ color: isToday ? accent : "white" }}>
                        {d.toLocaleDateString("de-DE", { day: "2-digit" })}
                      </span>
                      <div className="flex gap-0.5 sm:gap-1">
                        {dots.map((dot, j) => (
                          <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot.color }} />
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
        <div className="overflow-hidden" style={glassCard}>
          <div className="flex items-center gap-3 px-4 sm:px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Bot size={18} color={accent} />
            </div>
            <div>
              <p className="font-semibold text-sm">MüllBot</p>
              <p className="text-xs" style={{ color: accent }}>KI-Assistent · Erfurt</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          </div>

          <div className="px-4 sm:px-5 py-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
{messages.map((msg, i) => (
  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
    <div className="max-w-[85%] sm:max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
      style={msg.role === "user"
        ? { background: accent, color: "#060b13", fontWeight: 600, borderBottomRightRadius: 4 }
        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderBottomLeftRadius: 4 }
      }>
      {msg.content}
    </div>
  </div>
))}
{chatLoading && (
  <div className="flex justify-start">
    <div className="px-4 py-2.5 rounded-2xl text-sm animate-pulse"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
      Wird bearbeitet...
    </div>
  </div>
)}
            {chatLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Bot size={14} color={accent} />
                </div>
                <div className="px-4 py-2.5 rounded-2xl text-sm animate-pulse"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                  Wird bearbeitet...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 sm:px-5 pb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-xs px-3 py-1.5 rounded-xl transition"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="px-3 sm:px-4 py-3 flex gap-2 sm:gap-3 items-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <label className="cursor-pointer text-xl shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
              📷
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            <input
              type="text"
              placeholder="Wo kommt... rein?"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              className="flex-1 rounded-xl px-3 sm:px-4 py-2.5 text-white text-sm focus:outline-none"
              style={{ background: "rgba(20, 30, 45, 0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button onClick={() => handleSend()} disabled={chatLoading}
              className="font-bold px-3 sm:px-4 py-2.5 rounded-xl transition shrink-0 disabled:opacity-50"
              style={{ background: accent, color: "#060b13" }}>
              →
            </button>
          </div>
        </div>

<div className="mt-10 px-6 py-4 rounded-2xl text-center" style={glassCard}>
  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
    Daten von <span style={{ color: accent }}>SWE Stadtwirtschaft GmbH Erfurt</span>
  </p>
</div>

      </div>
    </div>
  );
}

export default Home;