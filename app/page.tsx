"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [pageId, setPageId] = useState("3c8eb4df13cc80059700f7ea0db308c2");
  const [customNotionKey, setCustomNotionKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [notionData, setNotionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [urlCopied, setUrlCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const userEmail = isSignedIn && user?.primaryEmailAddress?.emailAddress 
    ? user.primaryEmailAddress.emailAddress 
    : "Guest Sandbox User";

  const userInitial = userEmail.charAt(0).toUpperCase() || "B";

  const [userPlan, setUserPlan] = useState({
    name: "Free Sandbox",
    apiKey: "DEMO_KEY_sandbox_test",
    isPro: false,
    freeLeft: 3,
  });

  const pricingPlans = [
    {
      id: "1day",
      badge: "QUICK TEST",
      name: "1 Day Pass",
      price: "$1",
      duration: "Full access for 1 Day",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]",
      badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      priceClass: "text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]",
      btnClass: "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.5)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/99623721-d577-47c8-b0ea-fed625e08e6f",
    },
    {
      id: "10day",
      badge: "STARTER",
      name: "10 Days Pass",
      price: "$10",
      duration: "Full access for 10 Days",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)]",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      priceClass: "text-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]",
      btnClass: "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.5)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/2458b927-265f-4303-a5c2-1eb8cab49328",
    },
    {
      id: "monthly",
      badge: "MOST POPULAR",
      name: "Monthly Pro",
      price: "$19",
      duration: "Full access for 1 Month",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-fuchsia-400/80 shadow-[0_0_40px_rgba(217,70,239,0.45)] hover:shadow-[0_0_55px_rgba(217,70,239,0.7)] scale-[1.04] z-10",
      badgeClass: "bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/60 font-black",
      priceClass: "text-fuchsia-300 drop-shadow-[0_0_22px_rgba(217,70,239,0.8)]",
      btnClass: "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-black shadow-[0_0_30px_rgba(217,70,239,0.6)] animate-pulse",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/7fc670da-7119-4663-ab28-4a12447f612a",
    },
    {
      id: "quarterly",
      badge: "BEST VALUE",
      name: "Quarterly Pro",
      price: "$49",
      duration: "Full access for 3 Months",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      priceClass: "text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]",
      btnClass: "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.5)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/a8c9588e-27ae-4505-90c8-4b9bea1fa37f",
    },
    {
      id: "yearly",
      badge: "VIP ENTERPRISE",
      name: "Yearly Pro",
      price: "$100",
      duration: "Full access for 1 Year",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.25)] hover:shadow-[0_0_35px_rgba(244,63,94,0.5)]",
      badgeClass: "bg-rose-500/20 text-rose-300 border-rose-400/40 font-black",
      priceClass: "text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]",
      btnClass: "bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 hover:opacity-95 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.5)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/46871f9e-b885-4160-9779-5976532df643",
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("notion_saas_user_plan");
    if (saved) {
      try {
        setUserPlan(JSON.parse(saved));
      } catch {}
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      const planName = params.get("plan") ? `${params.get("plan").toUpperCase()} Pro Active` : "Pro Active";
      let existingKey = "LIVE_PRO_KEY_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.apiKey && parsed.apiKey.startsWith("LIVE_PRO_KEY_")) {
            existingKey = parsed.apiKey;
          }
        } catch {}
      }

      const activePlan = {
        name: planName,
        apiKey: existingKey,
        isPro: true,
        freeLeft: 999999,
      };
      setUserPlan(activePlan);
      localStorage.setItem("notion_saas_user_plan", JSON.stringify(activePlan));
    }
  }, []);

  const handleFetchJson = async () => {
    if (!pageId.trim()) {
      alert("Please enter a Notion Page ID!");
      return;
    }

    setLoading(true);
    setError(null);
    setNotionData(null);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": userPlan.apiKey,
        },
        body: JSON.stringify({
          pageId: pageId.trim(),
          apiKey: userPlan.apiKey,
          customNotionKey: customNotionKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotionData(data);
      } else {
        setError(data.error || "Failed to fetch JSON response from Notion");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch API data");
    } finally {
      setLoading(false);
    }
  };

  const dynamicApiUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/convert?pageId=${pageId.trim()}&apiKey=${userPlan.apiKey}`
    : "";

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-between px-4 py-8 sm:px-12 bg-[#05010a] relative overflow-hidden font-sans">
      
      {/* GEMINI MULTI-COLOR FLOWING AURORA */}
      <style jsx global>{`
        @keyframes geminiWaveFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes geminiFlashGlow {
          0%, 100% { opacity: 0.35; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.75; transform: scale(1.15) rotate(15deg); }
        }

        @keyframes textGeminiShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gemini-ambient-canvas {
          background: linear-gradient(
            -45deg,
            #05010a,
            #1e0836,
            #0f172a,
            #1e1b4b,
            #3b0764,
            #042f2e,
            #31104b,
            #172554,
            #05010a
          );
          background-size: 350% 350%;
          animation: geminiWaveFlow 14s ease infinite;
        }

        .gemini-orb-1 { animation: geminiFlashGlow 7s ease-in-out infinite; }
        .gemini-orb-2 { animation: geminiFlashGlow 9s ease-in-out infinite 2s; }
        .gemini-orb-3 { animation: geminiFlashGlow 11s ease-in-out infinite 4s; }

        .gemini-title-gradient {
          background: linear-gradient(
            90deg,
            #38bdf8,
            #818cf8,
            #c084fc,
            #f472b6,
            #fb7185,
            #facc15,
            #4ade80,
            #2dd4bf,
            #38bdf8
          );
          background-size: 250% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: textGeminiShimmer 6s linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 gemini-ambient-canvas pointer-events-none -z-30"></div>
      <div className="fixed top-[-10%] left-[10%] w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/30 via-indigo-600/35 to-blue-500/20 rounded-full blur-[140px] pointer-events-none -z-20 gemini-orb-1"></div>
      <div className="fixed top-[30%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-bl from-fuchsia-600/35 via-purple-600/30 to-pink-500/30 rounded-full blur-[160px] pointer-events-none -z-20 gemini-orb-2"></div>
      <div className="fixed bottom-[-10%] left-[25%] w-[650px] h-[650px] bg-gradient-to-r from-emerald-500/25 via-amber-400/25 to-teal-500/30 rounded-full blur-[160px] pointer-events-none -z-20 gemini-orb-3"></div>

      <div className="w-full max-w-5xl space-y-8 z-10 mx-auto my-auto">
        
        {/* HEADER */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight gemini-title-gradient drop-shadow-[0_0_35px_rgba(192,132,252,0.4)]">
            Notion to Live JSON API Engine
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300">
            Convert Notion databases into ultra-low latency JSON endpoints instantly.
          </p>
        </div>

        {/* AUTH STATUS */}
        <div className="max-w-xl mx-auto bg-[#10071f]/85 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-2xl shadow-[0_0_30px_rgba(147,51,234,0.15)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Authenticated Account:</p>
              <p className="text-xs font-semibold text-cyan-300">{userEmail}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`px-3.5 py-1 text-[11px] font-bold rounded-full border shadow-sm ${
                userPlan.isPro 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40" 
                  : "bg-amber-500/15 text-amber-300 border-amber-500/40"
              }`}>
                {userPlan.name}
              </span>
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black font-extrabold flex items-center justify-center text-xs shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-105 transition">
                    {userInitial}
                  </div>
                </SignInButton>
              ) : (
                <SignOutButton>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black font-extrabold flex items-center justify-center text-xs shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-105 transition" title="Sign Out">
                    {userInitial}
                  </div>
                </SignOutButton>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>YOUR ASSIGNED API KEY:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(userPlan.apiKey);
                  setKeyCopied(true);
                  setTimeout(() => setKeyCopied(false), 2000);
                }}
                className="hover:text-white transition lowercase font-medium text-xs text-cyan-300"
              >
                {keyCopied ? "copied!" : "Copy"}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={userPlan.apiKey}
              className="w-full bg-[#070210] border border-purple-900/50 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* DYNAMIC API PANEL */}
        <div className="max-w-4xl mx-auto bg-[#10071f]/85 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-2xl shadow-[0_0_35px_rgba(147,51,234,0.15)] space-y-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-sm font-bold flex items-center gap-1.5 ${
              userPlan.isPro ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
            }`}>
              {userPlan.isPro ? "🟢 Live Notion API Request" : "🟡 Demo Notion API Request"}
            </h2>
            <span className="text-[11px] text-gray-400">
              {userPlan.isPro ? "Production Endpoint (Unlimited Access)" : `Testing Sandbox (${userPlan.freeLeft} free left)`}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                placeholder="Enter Notion Page / Database ID..."
                className="w-full bg-[#070210] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition"
              />
              <button
                onClick={handleFetchJson}
                disabled={loading}
                className="px-7 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs whitespace-nowrap transition disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                {loading ? "Fetching..." : "Fetch JSON"}
              </button>
            </div>

            {/* Custom Notion Token (For Tier-1 client private databases) */}
            <input
              type="password"
              value={customNotionKey}
              onChange={(e) => setCustomNotionKey(e.target.value)}
              placeholder="Optional: Enter your own Notion Integration Secret (secret_...)"
              className="w-full bg-[#070210] border border-purple-900/30 rounded-xl px-4 py-1.5 text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              YOUR DYNAMIC API ENDPOINT URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={dynamicApiUrl}
                className="w-full bg-[#070210] border border-purple-900/50 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none shadow-inner"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(dynamicApiUrl);
                  setUrlCopied(true);
                  setTimeout(() => setUrlCopied(false), 2000);
                }}
                className="px-4 py-2 bg-[#1f0b3b] hover:bg-[#2c1252] border border-purple-600/40 text-xs font-semibold rounded-xl whitespace-nowrap transition text-purple-200"
              >
                {urlCopied ? "Copied! ✅" : "Copy URL"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/70 border border-red-500 text-red-200 text-xs rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              {error}
            </div>
          )}

          {notionData && (
            <div className="bg-[#070210] border border-emerald-500/50 rounded-xl p-4 space-y-2 mt-2 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">RESPONSE DATA (JSON)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(notionData, null, 2));
                    setJsonCopied(true);
                    setTimeout(() => setJsonCopied(false), 2000);
                  }}
                  className="text-xs px-2.5 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-mono hover:bg-emerald-900 transition"
                >
                  {jsonCopied ? "Copied! ✅" : "📋 Copy JSON"}
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <pre className="text-xs font-mono text-emerald-300">{JSON.stringify(notionData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* PRICING SECTION */}
        <div className="text-center space-y-1 pt-6">
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(217,70,239,0.35)]">
            Select Your Pro Access Plan
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            INSTANT ACTIVATION • HIGH PERFORMANCE LIVE ENDPOINTS • SECURE CHECKOUT
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch pb-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#10071f]/85 border ${plan.borderClass} rounded-2xl p-5 flex flex-col justify-between text-center backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5`}
            >
              <div className="space-y-3">
                <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${plan.badgeClass}`}>
                  {plan.badge}
                </span>

                <h3 className="text-sm font-bold text-gray-200">{plan.name}</h3>

                <div>
                  <p className={`text-4xl font-black ${plan.priceClass}`}>{plan.price}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{plan.duration}</p>
                </div>

                <div className="h-px bg-white/10 w-full my-2"></div>

                <ul className="text-[11px] text-gray-300 space-y-1.5 text-left pl-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={plan.link}
                target="_blank"
                rel="noreferrer"
                className={`mt-6 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider block transition ${plan.btnClass}`}
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-[11px] text-gray-500 pt-2 pb-4 space-y-1">
          <div className="flex justify-center gap-4 text-gray-400 text-[11px]">
            <a href="#" className="hover:underline">Terms of Service & Refund Policy</a>
            <span>•</span>
            <a href="mailto:developerappwebsite@gmail.com" className="hover:underline">Developer Support</a>
          </div>
          <p>© 2026 NotionEngine Inc. Built for technical teams and SaaS founders.</p>
        </footer>

      </div>
    </main>
  );
}