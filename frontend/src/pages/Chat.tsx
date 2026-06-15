import { useState, useRef, useEffect } from "react";
import api from "../services/api";

interface Message {
  role: "user" | "ai";
  content: string;
}

const suggestions = [
  "Wo kommt eine Batterie rein?",
  "Ist Pizzakarton Papiertonne?",
  "Was gehört in den Gelben Sack?",
  "Wo entsorge ich Medikamente?",
];

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hallo! Ich bin dein Müll-Assistent für Erfurt. Ich helfe dir bei Fragen zur Mülltrennung. Was möchtest du wissen? 🗑️",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text ?? input;
    if (!message.trim()) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/ai/chat", { message });
      const aiMessage: Message = { role: "ai", content: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Es gab einen Fehler. Bitte versuche es erneut." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-gray-950 font-bold text-lg">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">MüllBot</h2>
            <p className="text-green-400 text-xs">KI-Assistent · Erfurt</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col gap-4 mb-4 overflow-y-auto min-h-[300px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-xs flex-shrink-0 mb-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-green-400 text-gray-950 font-medium rounded-br-sm"
                    : "bg-gray-800 text-white border border-gray-700 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-xs flex-shrink-0">
                🤖
              </div>
              <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-gray-400">
                <span className="animate-pulse">Wird bearbeitet...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-2 rounded-xl hover:border-green-400 hover:text-green-400 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Stell mir eine Frage zur Mülltrennung..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="bg-green-400 text-gray-950 font-bold px-5 py-3 rounded-xl hover:opacity-80 transition disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;