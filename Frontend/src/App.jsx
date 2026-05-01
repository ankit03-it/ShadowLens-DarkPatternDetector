import { useState } from "react";
import axios from "axios";

export default function App() {
  const [mode, setMode] = useState("url");
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      let res;

      if (mode === "url") {
        res = await axios.post("http://127.0.0.1:5000/analyze-url", {
          url: input,
          mode: "selenium",
        });
        setResults(res.data.detections || []);
      } else {
        res = await axios.post("http://127.0.0.1:5000/predict", {
          text: input,
        });
        setResults([res.data]);
      }
    } catch (err) {
      console.error("API Error:", err);
    }

    setLoading(false);
  };

  const clamp = (num) => Math.min(Math.max(num, 0), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* NAVBAR */}
      <div className="backdrop-blur-lg bg-black/30 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ShadowLens
          </h1>
          <span className="text-xs text-gray-400">AI ACTIVE</span>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center py-16 px-4">
        <h2 className="text-5xl font-bold mb-4">
          Detect Dark Patterns Instantly
        </h2>
        <p className="text-gray-300">
          Analyze websites or text using AI
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6">

          {/* MODE */}
          <div className="flex justify-center gap-3 mb-6">
            {["url", "text"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg ${
                  mode === m
                    ? "bg-purple-500 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {m === "url" ? "🌐 URL" : "📝 Text"}
              </button>
            ))}
          </div>

          {/* INPUT */}
          {mode === "url" ? (
            <input
              type="text"
              placeholder="Enter website URL..."
              className="w-full p-3 bg-gray-900 rounded border border-gray-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          ) : (
            <textarea
              placeholder="Paste text..."
              className="w-full p-3 bg-gray-900 rounded border border-gray-700"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}

          {/* BUTTON */}
          <button
            onClick={handleScan}
            disabled={!input || loading}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-2xl mx-auto px-4 space-y-4 pb-16">
        {results.map((item, i) => {
          const confidence = clamp(item.confidence || 0);

          return (
            <div
              key={i}
              className="bg-black/40 border border-white/10 rounded-lg p-4"
            >
              <p className="font-semibold mb-2">
                {item.text || item.input}
              </p>

              <p className="text-sm text-gray-400">
                Type: {item.analysis?.type || "Unknown"}
              </p>

              {/* Confidence */}
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs mt-1">
                  {(confidence * 100).toFixed(1)}%
                </p>
              </div>

              {/* Explanation */}
              <p className="text-sm mt-3 text-gray-300">
                {item.analysis?.explanation || "No explanation"}
              </p>
            </div>
          );
        })}
      </div>

      {/* LOADER OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-white">Analyzing...</div>
        </div>
      )}
    </div>
  );
}