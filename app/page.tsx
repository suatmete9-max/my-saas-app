"use client";
import { useState } from "react";

export default function Home() {
  const [pageId, setPageId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold mb-4 text-center">Notion Page to Instant JSON API</h1>
      <p className="text-slate-400 mb-8 text-center max-w-md">Turn any Notion database or document into a production-ready API in seconds.</p>
      
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl space-y-4">
        <input 
          type="text" 
          placeholder="Paste Notion Page/Block ID" 
          value={pageId}
          onChange={(e) => setPageId(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleConvert} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? "Generating API..." : "Get Live JSON API"}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-slate-950 rounded border border-slate-800 max-h-48 overflow-auto">
            <pre className="text-xs text-green-400">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mt-12 text-center p-6 bg-slate-900/50 rounded-xl border border-slate-800 max-w-sm">
        <h3 className="text-xl font-bold mb-2">Pro Unlimited Plan</h3>
        <p className="text-3xl font-extrabold mb-4">$19 <span className="text-sm font-normal text-slate-400">/mo</span></p>
        <a 
          href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "#"} 
          target="_blank" 
          className="block w-full bg-green-600 hover:bg-green-500 font-bold py-3 rounded-lg transition"
        >
          Upgrade to Unlimited API
        </a>
      </div>
    </div>
  );
}